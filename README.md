# SlotSwapper

SlotSwapper is a peer-to-peer time-slot scheduling application. Users create calendar events (slots), mark some as **swappable**, and propose swaps with other users' swappable slots. If the other user accepts, the two events exchange owners and their statuses update accordingly.

Live demo: *(optional — add your deployed links here)*

---

## Features

- User authentication (Signup / Login) with JWT.
- CRUD for user events (slots).
- Mark events as `SWAPPABLE` to show in the marketplace.
- Create swap requests: puts both slots in `SWAP_PENDING`.
- Accept / Reject swap requests. Accept is executed atomically (MongoDB transaction) — owners are swapped and statuses set to `BUSY`.
- Frontend with Dashboard, Marketplace, Requests pages.
- Protected routes and dynamic UI updates.

---

## Design choices

- **Backend:** Node.js + Express + Mongoose (MongoDB). Mongoose models for `User`, `Event`, `SwapRequest`.
- **Frontend:** React + Vite + Axios for API calls. Simple, responsive UI with a clean card-based design.
- **Auth:** JWT stored in `localStorage` and sent as `Authorization: Bearer <token>`.
- **Atomic swaps:** implemented via MongoDB transactions to guarantee owners swap safely.
- **Simple UI:** lightweight CSS (no heavy UI framework) for readability and easy customization.

---

## Repo layout

/backend
├─ models/
├─ routes/
├─ middleware/
├─ server.js
├─ package.json
└─ .env (not committed)

/frontend
├─ src/
├─ package.json
└─ .env (not committed)


---

## Quick local setup (Full stack)

> **Prereqs:** Node.js (>=16), npm, Git, MongoDB (Atlas or local)

### 1) Clone repo
```bash
git clone https://github.com/<your-username>/slotswapper.git
cd slotswapper
2) Setup backend
cd backend
# install
npm install

# create .env
# Example .env (backend/.env)
# MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/slotswapper?retryWrites=true&w=majority
# JWT_SECRET=very_secret_here
# JWT_EXPIRES_IN=7d
# PORT=5000

# start backend (dev)
npm run dev     # or: node server.js

3) Setup frontend

Open a second terminal:

cd frontend
npm install

# create .env (frontend/.env)
# VITE_API_URL=http://localhost:5000/api

npm run dev
# open http://localhost:5173

