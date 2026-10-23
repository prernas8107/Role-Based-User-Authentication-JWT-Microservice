# Role-Based User Authentication & JWT Microservice

A production-ready Full Stack (MERN) Role-Based Access Control (RBAC) and JWT Authentication microservice built for the **Arrowstack Full Stack Development Internship (Task 1)**.

![Status](https://img.shields.io/badge/Status-Completed-success)
![MERN](https://img.shields.io/badge/Stack-MERN-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8)
![Security](https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-orange)

---

## 📌 Features

### 🔐 Authentication & Security
- **User Registration & Login**: Validated inputs with encrypted passwords using `bcryptjs` (salt rounds: 10).
- **JWT Authentication**: Generates cryptographically signed JSON Web Tokens (`jsonwebtoken`) on login with expiration.
- **Automatic Token Interceptor**: Frontend Axios instance automatically injects `Authorization: Bearer <token>` into all API requests.
- **Account Status Protection**: If an account is blocked by an Admin, login is immediately denied with `403 Forbidden`.

### 👥 Role-Based Access Control (RBAC)
- **Standard User (`user`)**:
  - Secure personal dashboard displaying profile information and access privileges.
  - Can only access protected user routes (`/api/auth/profile`).
  - Restricted from accessing administrative interfaces.
- **Administrator (`admin`)**:
  - Full access to the **Admin Control Panel**.
  - **Live Statistics Cards**: Total users, active users, blocked users, and admin count.
  - **Live Search & Filter**: Real-time search by user name/email with role & status filters.
  - **User Role Management**: Single-click **"Make Admin"** and **"Remove Admin"** actions.
  - **Account Control**: Instantly **Block** or **Unblock** users.
  - **User Creation & Deletion**: Add new users directly to MongoDB or permanently delete accounts.
  - **Self-Protection**: Administrators cannot accidentally demote or delete their own active account.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS v3, React Router v6, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Cloud Database), Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js |
| **HTTP Client** | Axios with Request Interceptors |

---

## 📂 Project Architecture

```text
├── client/                     # Frontend (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Navbar, ProtectedRoute
│   │   ├── context/            # AuthContext (Global Session & State)
│   │   ├── pages/              # Login, Register, Dashboard, AdminPanel
│   │   ├── services/           # Axios API Client with Bearer Token Injection
│   │   ├── App.jsx             # Route Configuration & Guards
│   │   ├── index.css           # Tailwind CSS directives
│   │   └── main.jsx            # Application Entry Point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Backend Microservice (Node.js + Express)
│   ├── config/                 # Database Connection (db.js with DNS resolver)
│   ├── controllers/            # authController.js, adminController.js
│   ├── middleware/             # authMiddleware.js (JWT), roleMiddleware.js (RBAC)
│   ├── models/                 # User.js (Mongoose Schema with role & status)
│   ├── routes/                 # authRoutes.js, adminRoutes.js
│   ├── .env.example            # Environment variables template
│   ├── package.json
│   └── server.js               # Express Server & Route Mounting
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas cluster or local MongoDB instance

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory (refer to `.env.example`):
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_jwt_key
```

Start the backend server:
```bash
npm run dev
```
*Server runs on `http://localhost:5000`*

### 3. Frontend Setup
In a new terminal:
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 📡 API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (default role: `user`, status: `active`) |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token |

### Protected User Endpoints (Requires Valid Token)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/auth/profile` | Retrieve authenticated user's profile |

### Protected Admin Endpoints (Requires Role: `admin`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/stats` | Retrieve user count, active, blocked, and admin statistics |
| `GET` | `/api/admin/users` | List users with optional `search`, `role`, and `status` query params |
| `POST` | `/api/admin/users` | Create a new user account with role assignment |
| `PATCH` | `/api/admin/users/:id` | Update user status (`active`/`blocked`) or role (`user`/`admin`) |
| `DELETE` | `/api/admin/users/:id` | Permanently remove a user account |

---

## 🛡️ License
This project is developed as part of the Arrowstack Internship Program for educational and evaluation purposes.
