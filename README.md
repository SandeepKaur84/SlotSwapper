# 🕒 SlotSwapper

**SlotSwapper** is a peer-to-peer time-slot scheduling web application where users can create calendar events, mark specific ones as **swappable**, and exchange them with others.  
It ensures safe, atomic swapping between users using MongoDB transactions.

🔗 **Live Demo:** [https://slotswapper-frontend-dei9.onrender.com](https://slotswapper-frontend-dei9.onrender.com)

---

## 📘 Overview

SlotSwapper enables users to manage and swap their calendar events seamlessly.  
Each user maintains personal events, marks some as *SWAPPABLE*, and can browse others’ available slots in the marketplace.  
When two users agree, the swap is executed atomically so ownership and statuses update together.

---

## ⚙️ Tech Stack & Design Choices

| Layer | Technology | Description |
|-------|-------------|-------------|
| **Frontend** | React + Vite + Axios | Fast, lightweight single-page app using React and Vite. Axios handles API requests. |
| **Backend** | Node.js + Express.js | RESTful API handling authentication, event management, and swaps. |
| **Database** | MongoDB Atlas (via Mongoose) | Cloud-hosted MongoDB cluster for persistent data. Mongoose provides schemas and validation. |
| **Auth** | JWT (JSON Web Tokens) | Tokens are stored in `localStorage` and sent in request headers. |
| **Atomic Swaps** | MongoDB Transactions | Ensures event ownership is swapped safely in a single operation. |

---

## 🧩 Features

✅ Secure user authentication (Signup / Login)  
✅ Create, view, update, and delete personal events  
✅ Mark or unmark events as `SWAPPABLE`  
✅ Explore marketplace to see other users’ available slots  
✅ Send, accept, or reject swap requests  
✅ Fully protected backend routes using JWT  
✅ Simple responsive UI for desktop and mobile  

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
| `POST` | `/api/auth/login` | Authenticate user and return JWT |
| **Event Routes** |
| `GET` | `/api/events/mine` | Fetch current user’s events |
| `POST` | `/api/events` | Create a new event |
| `PATCH` | `/api/events/:id` | Update an event (e.g., toggle swappable) |
| `DELETE` | `/api/events/:id` | Delete an event |
| **Marketplace Routes** |
| `GET` | `/api/market` | List all swappable events from all users |
| **Swap Routes** |
| `POST` | `/api/swaps/request` | Request to swap two events |
| `GET` | `/api/swaps/mine` | Fetch all swap requests involving current user |
| `PATCH` | `/api/swaps/:id/accept` | Accept swap request (atomic transaction) |
| `PATCH` | `/api/swaps/:id/reject` | Reject swap request |

---

## 🚀 Local Setup (MongoDB Atlas)

> **Requirements:**  
> - Node.js ≥ 16  
> - npm  
> - Git  
> - A MongoDB Atlas account (free cluster)

### 1️⃣ Clone Repository
```bash
git clone https://github.com/<your-username>/slotswapper.git
cd slotswapper
2️⃣ Setup Backend
cd backend
npm install


Create a .env file inside /backend:

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/slotswapper
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d
PORT=5000


🔑 You can get your MongoDB connection string from MongoDB Atlas → Database → Connect → Drivers → Node.js.

Start backend:

npm run dev     # or node server.js


Server runs at: http://localhost:5000

3️⃣ Setup Frontend

Open a new terminal:

cd frontend
npm install


Create .env inside /frontend:

VITE_API_URL=http://localhost:5000/api


Run frontend:

npm run dev


Visit http://localhost:5173