import express from "express";
import Event, { EVENT_STATUS } from "../models/Event.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
router.use(auth);

// GET all swappable slots from other users
router.get("/swappable-slots", async (req, res) => {
  // exclude current user's slots
  const slots = await Event.find({ owner: { $ne: req.user._id }, status: EVENT_STATUS.SWAPPABLE }).populate("owner", "name email");
  res.json(slots);
});

export default router;
