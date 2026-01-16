# 🚗 Car Wash Pro Automation System (MERN Stack)

A professional-grade automation platform for **real-time vehicle detection, service queue management, and CCTV simulation** at a car wash premises.

This document is written for **developers joining or contributing to the project**. It explains *what the system does*, *how it is structured*, and *how to work on it safely and consistently*.

---

## 📌 Table of Contents

1. Project Purpose & Scope
2. System Architecture (High-Level)
3. Repository Structure
4. Security & Repository Standards
5. Installation & Local Setup
6. Core Feature: License Plate Recognition (LPR)
7. Real-Time Dashboard Flow
8. Team Collaboration Workflow
9. Common Mistakes to Avoid

---

## 1️⃣ Project Purpose & Scope

The **Car Wash Pro Automation System** automates vehicle intake and service tracking at a car wash facility.

### What the system does:

* Detects vehicles entering the premises via cameras
* Captures and processes vehicle snapshots
* Extracts and stores license plate data
* Automatically queues vehicles for washing
* Displays real-time activity on a staff dashboard

### What the system does NOT do (yet):

* Perform physical camera control
* Control washing hardware directly
* Use real-world AI LPR models in production (currently simulated)

---

## 2️⃣ System Architecture (High-Level)

This project uses a **modular MERN stack** to ensure scalability, maintainability, and clean separation of concerns.

### Architecture Overview:

* **Frontend (React + Tailwind CSS)**

  * Staff dashboard
  * CCTV simulation view
  * Real-time queue updates

* **Backend (Node.js + Express)**

  * REST APIs
  * Authentication & authorization
  * Vehicle capture & processing logic

* **Database (MongoDB)**

  * Vehicle records
  * License plate metadata
  * User roles & activity logs

* **Automation Module**

  * Receives camera snapshots
  * Triggers License Plate Recognition logic
  * Pushes updates to the system

---

## 3️⃣ Repository Structure

```
car-wash-pro-automation/
│
├── client/                 # React frontend
│   ├── src/
│   └── package.json
│
├── server/                 # Node/Express backend
│   ├── controllers/        # Request handling logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Auth, error handling
│   ├── config/             # DB & app config
│   └── server.js
│
├── .gitignore
├── README.md
└── package.json
```

📌 **Rule:** Business logic must live in `controllers/`, never directly in routes.

---

## 4️⃣ Security & Repository Standards

This project follows a **"Lightweight & Secure" repository policy**.

### 🔒 Security Rules (Strict)

* ❌ **Never commit `.env` files**
* ❌ **Never commit `node_modules/`**
* ❌ **Never expose credentials in commits or PRs**

### ✅ Enforced Practices

* `.gitignore` excludes:

  * `node_modules/`
  * `.env`
  * logs & build artifacts

* All secrets are stored **locally only**

* MongoDB credentials were **rotated and cleaned from git history**

📌 If you accidentally expose secrets:

1. Rotate credentials immediately
2. Clean git history
3. Notify the team

---

## 5️⃣ Installation & Local Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/50shadescode/car-wash-pro-automation.git
cd car-wash-pro-automation
```

### Step 2: Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file inside the **`/server`** directory:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<new_password>@cluster...
JWT_SECRET=<your_secure_secret>
```

⚠️ Use a **new MongoDB password**. Old credentials are invalid.

---

## 6️⃣ Core Feature: License Plate Recognition (LPR)

The system uses **snapshot-based automation** rather than continuous video processing.

### LPR Flow (Step-by-Step):

1. **Capture**

   * A camera sends a POST request with an image
   * Endpoint: `POST /api/vehicles/capture`

2. **Processing**

   * Backend extracts `plateNumber` (simulated or external service)
   * Image metadata is stored in MongoDB

3. **Queue Trigger**

   * Vehicle is added to the wash queue
   * Status is initialized (e.g., `ENTERED`)

4. **Dashboard Update**

   * Frontend updates CCTV simulation
   * Queue state updates in real time

📌 LPR logic is **abstracted** so real AI services can be plugged in later.

---

## 7️⃣ Real-Time Dashboard Flow

The dashboard reflects the live state of the car wash.

### Typical Vehicle Lifecycle:

```
ENTERED → QUEUED → WASHING → COMPLETED
```

### Frontend Responsibilities:

* Display vehicle snapshots
* Show queue order
* Reflect status transitions

### Backend Responsibilities:

* Maintain source-of-truth state
* Validate transitions
* Broadcast updates (Socket.IO or polling)

---

## 8️⃣ Team Collaboration Workflow

### 🌿 Branching Strategy

* **Never push directly to `main`**
* Create feature branches:

```bash
git checkout -b feature/lpr-logic
```

### ✅ Before Pushing Code

* Client starts successfully
* Server starts without errors
* No secrets added to git

### 🚫 Prohibited Commands

```bash
git add .env
git add node_modules
```

---

## 9️⃣ Common Mistakes to Avoid

❌ Mixing business logic into routes
❌ Hardcoding credentials
❌ Skipping local testing
❌ Large commits with unrelated changes
❌ Pushing broken builds

---

## ✅ Final Notes for New Developers

* Read this document fully before coding
* Follow structure and naming conventions
* Ask before making architectural changes
* Security mistakes affect the entire team

Welcome to the project 🚀
