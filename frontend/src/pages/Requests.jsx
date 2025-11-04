import React, { useEffect, useState } from "react";
import API from "../api";

export default function Requests() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  const load = async () => {
    const res = await API.get("/swaps/my-requests");
    setIncoming(res.data.incoming);
    setOutgoing(res.data.outgoing);
  };

  useEffect(() => {
    load();
  }, []);

  const respond = async (id, accept) => {
    await API.post(`/swaps/swap-response/${id}`, { accept });
    load(); // refresh state dynamically
  };

  return (
    <div>
      <h2>Incoming Swap Requests</h2>
      {incoming.map((req) => (
        <div key={req._id}>
          <p>
            <b>{req.requester.name}</b> wants to swap their{" "}
            <i>{req.mySlot.title}</i> for your{" "}
            <i>{req.theirSlot.title}</i> — {req.status}
          </p>
          {req.status === "PENDING" && (
            <>
              <button onClick={() => respond(req._id, true)}>Accept</button>
              <button onClick={() => respond(req._id, false)}>Reject</button>
            </>
          )}
        </div>
      ))}

      <h2>Outgoing Swap Requests</h2>
      {outgoing.map((req) => (
        <div key={req._id}>
          <p>
            To <b>{req.responder.name}</b>: my <i>{req.mySlot.title}</i> for
            their <i>{req.theirSlot.title}</i> — {req.status}
          </p>
        </div>
      ))}
    </div>
  );
}
