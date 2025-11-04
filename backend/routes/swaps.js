import express from "express";
import mongoose from "mongoose";
import { auth } from "../middleware/auth.js";
import Event, { EVENT_STATUS } from "../models/Event.js";
import SwapRequest, { SWAP_STATUS } from "../models/SwapRequest.js";

const router = express.Router();
router.use(auth);

// POST /api/swap-request
router.post("/swap-request", async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body;
    if (!mySlotId || !theirSlotId) return res.status(400).json({ msg: "Provide mySlotId and theirSlotId" });

    // load both slots
    const [mySlot, theirSlot] = await Promise.all([
      Event.findById(mySlotId),
      Event.findById(theirSlotId),
    ]);
    if (!mySlot || !theirSlot) return res.status(404).json({ msg: "Slot not found" });

    // validation
    if (!mySlot.owner.equals(req.user._id)) return res.status(403).json({ msg: "mySlot not owned by you" });
    if (theirSlot.owner.equals(req.user._id)) return res.status(400).json({ msg: "theirSlot must belong to another user" });

    if (mySlot.status !== EVENT_STATUS.SWAPPABLE || theirSlot.status !== EVENT_STATUS.SWAPPABLE) {
      return res.status(400).json({ msg: "Both slots must be SWAPPABLE" });
    }

    // create swap request and set both slots to SWAP_PENDING
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const swap = await SwapRequest.create([{
        requester: req.user._id,
        responder: theirSlot.owner,
        mySlot: mySlot._id,
        theirSlot: theirSlot._id,
      }], { session });

      mySlot.status = EVENT_STATUS.SWAP_PENDING;
      theirSlot.status = EVENT_STATUS.SWAP_PENDING;
      await mySlot.save({ session });
      await theirSlot.save({ session });

      await session.commitTransaction();
      session.endSession();

      const createdSwap = await SwapRequest.findById(swap[0]._id).populate("requester responder mySlot theirSlot");
      return res.json(createdSwap);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/swap-response/:requestId
router.post("/swap-response/:requestId", async (req, res) => {
  const accept = !!req.body.accept;
  const { requestId } = req.params;

  const swap = await SwapRequest.findById(requestId).populate("mySlot theirSlot requester responder");
  if (!swap) return res.status(404).json({ msg: "SwapRequest not found" });

  // Only responder can accept/reject
  if (!swap.responder._id.equals(req.user._id)) return res.status(403).json({ msg: "Only responder can respond" });
  if (swap.status !== SWAP_STATUS.PENDING) return res.status(400).json({ msg: "Swap not pending" });

  if (!accept) {
    // Rejection path: mark REJECTED and set events back to SWAPPABLE
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      swap.status = SWAP_STATUS.REJECTED;
      await swap.save({ session });

      await Event.findByIdAndUpdate(swap.mySlot._id, { status: EVENT_STATUS.SWAPPABLE }, { session });
      await Event.findByIdAndUpdate(swap.theirSlot._id, { status: EVENT_STATUS.SWAPPABLE }, { session });

      await session.commitTransaction();
      session.endSession();

      return res.json({ msg: "Rejected", swap });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } else {
    // Accept: swap owners and set events back to BUSY (atomic)
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // reload within session to avoid stale data
      const mySlot = await Event.findById(swap.mySlot._id).session(session);
      const theirSlot = await Event.findById(swap.theirSlot._id).session(session);

      // Validation inside txn: still in SWAP_PENDING and owners match
      if (mySlot.status !== EVENT_STATUS.SWAP_PENDING || theirSlot.status !== EVENT_STATUS.SWAP_PENDING) {
        throw new Error("One of the slots is not pending");
      }

      // Swap owners
      const tmpOwner = mySlot.owner;
      mySlot.owner = theirSlot.owner;
      theirSlot.owner = tmpOwner;

      // After swap, mark both as BUSY
      mySlot.status = EVENT_STATUS.BUSY;
      theirSlot.status = EVENT_STATUS.BUSY;

      await mySlot.save({ session });
      await theirSlot.save({ session });

      swap.status = SWAP_STATUS.ACCEPTED;
      await swap.save({ session });

      await session.commitTransaction();
      session.endSession();

      const populated = await SwapRequest.findById(swap._id).populate("requester responder mySlot theirSlot");
      return res.json({ msg: "Accepted", swap: populated });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err);
      return res.status(500).json({ msg: err.message });
    }
  }
});

// Get incoming/outgoing swaps for dashboard
router.get("/my-requests", async (req, res) => {
  const incoming = await SwapRequest.find({ responder: req.user._id }).populate("requester responder mySlot theirSlot").sort({ createdAt: -1 });
  const outgoing = await SwapRequest.find({ requester: req.user._id }).populate("requester responder mySlot theirSlot").sort({ createdAt: -1 });
  res.json({ incoming, outgoing });
});

export default router;
