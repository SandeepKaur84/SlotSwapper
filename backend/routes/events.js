import express from "express";
import Event, { EVENT_STATUS } from "../models/Event.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

// Create event
router.post("/", async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body;
    const ev = new Event({ title, startTime, endTime, owner: req.user._id, status: EVENT_STATUS.BUSY });
    await ev.save();
    res.json(ev);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get my events
router.get("/mine", async (req, res) => {
  const events = await Event.find({ owner: req.user._id }).sort({ startTime: 1 });
  res.json(events);
});

// Update event (including status change)
router.patch("/:id", async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ msg: "Not found" });
    if (!ev.owner.equals(req.user._id)) return res.status(403).json({ msg: "Forbidden" });

    const allowed = ["title","startTime","endTime","status","metadata"];
    allowed.forEach(k => { if (req.body[k] !== undefined) ev[k] = req.body[k]; });
    await ev.save();
    res.json(ev);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete
router.delete("/:id", async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ msg: "Not found" });
  if (!ev.owner.equals(req.user._id)) return res.status(403).json({ msg: "Forbidden" });
  await ev.remove();
  res.json({ success: true });
});

export default router;
