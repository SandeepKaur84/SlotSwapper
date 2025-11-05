# 🕒 SlotSwapper

**SlotSwapper** is a peer-to-peer time-slot scheduling web application where users can create personal calendar events, mark specific ones as **swappable**, and exchange them with others. The app ensures a smooth, atomic swap process so that no data conflicts occur.

🔗 **Live Demo:** [https://slotswapper-frontend-dei9.onrender.com](https://slotswapper-frontend-dei9.onrender.com)

---

## 📘 Overview

SlotSwapper allows users to manage and swap calendar events seamlessly. Each user maintains their schedule, can mark events as *SWAPPABLE*, and view available slots in the marketplace. Users can then propose swaps, and if accepted, both events are automatically exchanged using a MongoDB transaction.

---

## ⚙️ Tech Stack & Design Choices

| Layer | Technology | Description |
|-------|-------------|-------------|
| **Frontend** | React + Vite + Axios | Built with React (Vite setup) for fast builds and a smooth SPA experience. Axios handles API requests. |
| **Backend** | Node.js + Express.js | Provides RESTful API endpoints for authentication, event management, and swaps. |
| **Database** | MongoDB + Mongoose | Stores users, events, and swap requests. Mongoose handles schema validation and relations. |
| **Auth** | JWT (JSON Web Token) | Tokens are stored in `localStorage` and sent with requests for authentication. |
| **Atomic Swaps** | MongoDB Transactions | Ensures both events update together safely when a swap is accepted. |

---

## 🧩 Features

✅ User authentication (Signup / Login)  
✅ Create, Read, Update, and Delete user events  
✅ Mark events as `SWAPPABLE` or `BUSY`  
✅ Browse marketplace for available swappable events  
✅ Send, accept, or reject swap requests  
✅ Fully protected API routes (JWT-based)  
✅ Responsive, minimal UI for simplicity and performance  

---

## 🗂️ Project Structure

/slotswapper
│
├── /backend
│ ├── /models
│ ├── /routes
│ ├── /middleware
│ ├── server.js
│ ├── package.json
│ └── .env (not committed)
│
└── /frontend
├── /src
├── package.json
└── .env (not committed)


---

## 🧭 API Endpoints Overview

| Method | Endpoint | Description |
|--------|-----------|-------------|
| **Auth Routes** |
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Log in and get JWT token |
| **Event Routes** |
| `GET` | `/api/events/mine` | Fetch logged-in user's events |
| `POST` | `/api/events` | Create a new event |
| `PATCH` | `/api/events/:id` | Update an event (e.g., toggle swappable) |
| `DELETE` | `/api/events/:id` | Delete an event |
| **Marketplace Routes** |
| `GET` | `/api/market` | Get all available swappable events |
| **Swap Routes** |
| `POST` | `/api/swaps/request` | Propose a swap between two event IDs |
| `GET` | `/api/swaps/mine` | Fetch user’s swap requests |
| `PATCH` | `/api/swaps/:id/accept` | Accept a swap request (atomic transaction) |
| `PATCH` | `/api/swaps/:id/reject` | Reject a swap request |
---

## 🚀 Local Setup Guide

> **Prerequisites:**  
> Node.js ≥ 16, npm, Git, and a MongoDB connection (local or Atlas).

### 1️⃣ Clone Repository
```bash
git clone https://github.com/<your-username>/slotswapper.git
cd slotswapper
2️⃣ Setup Backend
cd backend
npm install


Create a .env file inside /backend:

MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/slotswapper
JWT_SECRET=very_secret_key_here
JWT_EXPIRES_IN=7d
PORT=5000


Run backend:

npm run dev     # or node server.js


Server runs at: http://localhost:5000

3️⃣ Setup Frontend

Open a new terminal:

cd frontend
npm install


Create /frontend/.env:

VITE_API_URL=http://localhost:5000/api


Run frontend:

npm run dev


Then open: http://localhost:5173