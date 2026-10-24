# Role-Based User Authentication & JWT Microservice

This is a full stack MERN project I built as Task 1 for the Arrowstack Full Stack Development Internship. The goal was to implement a secure authentication system with role-based access control using JWT tokens.

---

## What this project does

Users can register and log in. When they register, they are assigned a standard user role by default. Admins have a separate control panel where they can manage users — promote them to admin, block or unblock their accounts, and delete them if needed.

The whole thing is built with MongoDB, Express, React, and Node.js. Passwords are hashed using bcrypt before storing in the database, and authentication is handled via signed JWT tokens.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v3, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| HTTP Client | Axios with request interceptor |

---

## Demo Credentials

I have pre-seeded two accounts in the database for testing:

| Role | Email | Password |
|---|---|---|
| Admin | admin@gmail.com | 123456 |
| User | user@gmail.com | 123456 |

You can also register a new account from the register page. It will be assigned the user role by default. You can then log in as admin and promote it.

---

## Features

**Authentication**
- Register with name, email, and password
- Password is hashed with bcrypt (10 salt rounds) before saving
- Login returns a signed JWT token
- Blocked accounts cannot log in

**Standard User**
- Sees a dashboard with their profile info and their assigned role/permissions
- Cannot access the admin panel

**Admin**
- Full Admin Control Panel at /admin
- Can see total users, active users, blocked users, and admin count
- Can search and filter users by role or status
- Can make any user an admin or remove their admin rights
- Can block or unblock users
- Can add new users directly
- Can delete user accounts
- Cannot demote or delete themselves (self-protection built in)

---

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── index.html
│   └── vite.config.js
│
└── server/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   └── adminController.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── roleMiddleware.js
    ├── models/
    │   └── User.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── adminRoutes.js
    ├── .env.example
    └── server.js
```

---

## API Endpoints

**Public**

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and get JWT token |

**Protected (any logged in user)**

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/auth/profile | Get logged in user profile |

**Admin only**

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/admin/stats | Get user counts and stats |
| GET | /api/admin/users | Get all users (supports search, role, status filters) |
| POST | /api/admin/users | Create a new user |
| PATCH | /api/admin/users/:id | Update user role or status |
| DELETE | /api/admin/users/:id | Delete a user |

---

## How to run locally

**Backend**

```bash
cd server
npm install
```

Create a `.env` file in the server folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

```bash
npm run dev
```

Server starts at http://localhost:5000

**Frontend**

```bash
cd client
npm install
npm run dev
```

Frontend starts at http://localhost:3000

---

## Notes

- The register page only takes name, email, and password. No role selection is shown to users — all public signups get the user role automatically.
- The dashboard only shows profile info and access privileges. No raw token is shown.
- Admin can promote/demote other users but cannot change their own role or delete themselves.

---

**Author:** Prerna Saini  
**GitHub:** [@prernas8107](https://github.com/prernas8107)  
**Internship:** Arrowstack Full Stack Development Internship 2026
