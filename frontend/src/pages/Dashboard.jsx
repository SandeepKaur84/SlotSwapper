import React, { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", startTime: "", endTime: "" });

  // Fetch user events
  const load = async () => {
    try {
      const { data } = await API.get("/events/mine");
      setEvents(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load events");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Create event
  const create = async (e) => {
    e.preventDefault();
    try {
      await API.post("/events", {
        title: form.title,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      });
      setForm({ title: "", startTime: "", endTime: "" });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating event");
    }
  };

  // Toggle swappable status
  const toggleSwappable = async (ev) => {
    const newStatus = ev.status === "SWAPPABLE" ? "BUSY" : "SWAPPABLE";
    await API.patch(`/events/${ev._id}`, { status: newStatus });
    load();
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h2 className="page-title">My Events</h2>

        {/* Create Event Form */}
        <form className="event-form" onSubmit={create}>
          <input
            placeholder="Event Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="datetime-local"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            required
          />
          <input
            type="datetime-local"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            required
          />
          <button type="submit" className="btn">
            + Add Event
          </button>
        </form>

        {/* Event List */}
        <div className="event-grid">
          {events.length ? (
            events.map((ev) => (
              <div key={ev._id} className="card event-card">
                <h3>{ev.title}</h3>
                <p>
                  <b>From:</b>{" "}
                  {new Date(ev.startTime).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <p>
                  <b>To:</b>{" "}
                  {new Date(ev.endTime).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>

                <p>
                  Status:{" "}
                  <span className={`status ${ev.status.toLowerCase()}`}>
                    {ev.status}
                  </span>
                </p>
                <button
                  onClick={() => toggleSwappable(ev)}
                  className={`btn ${
                    ev.status === "SWAPPABLE" ? "btn-outline" : ""
                  }`}
                >
                  {ev.status === "SWAPPABLE"
                    ? "Unmark Swappable"
                    : "Make Swappable"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-muted center">No events yet. Add one above!</p>
          )}
        </div>
      </div>
    </>
  );
}
