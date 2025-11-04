import React, { useEffect, useState } from "react";
import API from "../api";

export default function Marketplace() {
  const [slots, setSlots] = useState([]);
  const [mySwappables, setMySwappables] = useState([]);
  const [selectedTheirSlot, setSelectedTheirSlot] = useState(null);

  const load = async () => {
    const { data: market } = await API.get("/market/swappable-slots");
    const { data: mine } = await API.get("/events/mine");
    setSlots(market);
    setMySwappables(mine.filter((e) => e.status === "SWAPPABLE"));
  };

  useEffect(() => {
    load();
  }, []);

  const requestSwap = async (theirSlotId, mySlotId) => {
    await API.post("/swaps/swap-request", { mySlotId, theirSlotId });
    alert("Swap request sent!");
    setSelectedTheirSlot(null);
  };

  return (
    <div>
      <h2>Available Swappable Slots</h2>
      <ul>
        {slots.map((slot) => (
          <li key={slot._id}>
            <b>{slot.title}</b> —{" "}
            {new Date(slot.startTime).toLocaleString()} ({slot.owner?.name})
            <button onClick={() => setSelectedTheirSlot(slot)}>
              Request Swap
            </button>
          </li>
        ))}
      </ul>

      {selectedTheirSlot && (
        <div className="modal">
          <h3>
            Offer one of your swappable slots for {selectedTheirSlot.title}
          </h3>
          {mySwappables.length ? (
            <ul>
              {mySwappables.map((ms) => (
                <li key={ms._id}>
                  <b>{ms.title}</b>{" "}
                  <button
                    onClick={() =>
                      requestSwap(selectedTheirSlot._id, ms._id)
                    }
                  >
                    Offer This
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No swappable slots available.</p>
          )}
          <button onClick={() => setSelectedTheirSlot(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
