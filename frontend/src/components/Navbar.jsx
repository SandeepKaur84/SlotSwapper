import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/App.css"; 

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h1>SlotSwapper</h1>
      <ul>
        <li><Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link></li>
        <li><Link to="/marketplace" style={{ color: "white", textDecoration: "none" }}>Marketplace</Link></li>
        <li><Link to="/requests" style={{ color: "white", textDecoration: "none" }}>Requests</Link></li>
        <li><button onClick={logout}>Logout</button></li>
      </ul>
    </nav>
  );
}
