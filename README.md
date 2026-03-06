# Primetrade Backend Intern Assignment

A scalable full-stack application demonstrating robust REST API design, secure JWT authentication, Role-Based Access Control (RBAC), and a dynamic React frontend with full product CRUD operations.

##  Technologies Used

### Backend
- **Node.js & Express.js**: High-performance REST API
- **MongoDB & Mongoose**: Flexible NoSQL database
- **JWT (JSON Web Tokens)**: Secure, stateless authentication
- **Bcrypt.js**: One-way secure password hashing
- **Swagger UI**: Interactive API documentation at `/api-docs`

### Frontend
- **React.js & Vite**: Lightning-fast frontend build tool
- **React Router V6**: Declarative client-side routing
- **Axios**: HTTP client with automatic JWT injection
- **Vanilla CSS**: Premium glassmorphism styling, responsive grids

---

## 📸 Screenshots

### Login Page
![Login Page](./screenshots/login.png)

### Register Page
![Register Page](./screenshots/register.png)

### Dashboard — Product Grid
![Dashboard](./screenshots/dashboard.png)

### Editing a Selected Product
![Product Selected](./screenshots/product_selected.png)

### Inline Delete Confirmation
![Delete Confirmation](./screenshots/delete_confirm.png)

---

## ⚙️ Prerequisites

Before running the app, make sure you have the following installed:

| Tool | Version | Install |
|------|---------|---------|
| Node.js | v16+ | [nodejs.org](https://nodejs.org/) |
| npm | v8+ | Comes with Node.js |
| MongoDB | v5+ | [mongodb.com](https://www.mongodb.com/try/download/community) |

---

## 🗄️ Step 1 — Start MongoDB

The backend requires a running MongoDB instance on port `27017`.

### Option A: Use system MongoDB service (recommended)
```bash
# Start MongoDB
sudo systemctl start mongod

# Verify it's running
sudo systemctl status mongod
```

### Option B: Run MongoDB manually (no sudo needed)
```bash
# Create a local data directory
mkdir -p ./data/db

# Start MongoDB pointing to that directory
mongod --dbpath ./data/db --port 27017
```

> Keep this terminal open — MongoDB must be running while you use the app.

---

## 🔧 Step 2 — Backend Setup

Open a **new terminal** and run:

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install
```

### Configure Environment Variables

The `.env` file in the `backend/` folder should contain:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/primetrade_intern
JWT_SECRET=supersecretjwtkey_change_me_in_prod
NODE_ENV=development
```

> ⚠️ If you use MongoDB Atlas (cloud), replace `MONGODB_URI` with your Atlas connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/dbname`).

### Start the Backend Server

```bash
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: 127.0.0.1
```

**Backend API** is live at: `http://localhost:5000`  
**Swagger Docs** are live at: `http://localhost:5000/api-docs`

---

## 🎨 Step 3 — Frontend Setup

Open a **new terminal** and run:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the Vite dev server
npm run dev
```

You should see something like:
```
VITE v7.x.x  ready in 400ms

  ➜  Local:   http://localhost:5173/
```

**Frontend App** is live at: `http://localhost:5173`

---

## 🛍️ Step 4 — Create Your First User

Once both servers are running, open the app in your browser at `http://localhost:5173` and:

1. Click **"Register"** in the navbar
2. Fill in your name, email, and password
3. Choose a role: `user` or `admin`
4. Submit to create your account and be logged in automatically

> **Admin accounts** can create, edit, and delete products. **User accounts** can view and manage products too (RBAC is configurable).

### Pre-seeded Test Accounts (if you used the seed script)

| Email | Password | Role |
|-------|----------|------|
| `admin@example.com` | `password123` | admin |
| `user@example.com` | `password123` | user |

---

## 🛍️ Step 5 — Using the Dashboard

Once logged in, you can:

| Action | How |
|--------|-----|
| **View Products** | Products are displayed as cards with ₹ pricing |
| **Add Product** | Fill the form at the top of the Dashboard and click 🚀 Create Product |
| **Select/Edit Product** | Click any product card — it highlights and populates the form |
| **Save Edits** | After selecting a product, modify details and click 💾 Save Changes |
| **Delete Product** | Click 🗑️ Delete on a card → confirm with "Yes, Delete" inline |

---

## 📋 API Endpoints Reference

### Auth Routes — `/api/v1/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login and receive JWT token |
| GET | `/me` | Get logged-in user profile |

### Product Routes — `/api/v1/products` *(requires JWT)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all products |
| POST | `/` | Create a new product |
| GET | `/:id` | Get a single product |
| PUT | `/:id` | Update a product |
| DELETE | `/:id` | Delete a product |

Full interactive docs: **`http://localhost:5000/api-docs`**

---


## 🔒 Security Features

- **Helmet** — Secures HTTP headers
- **CORS** — Enables safe cross-origin requests from the frontend
- **JWT Validation** — `protect` middleware verifies token on every protected route
- **Password Hashing** — Bcrypt with salt rounds for secure storage
- **Global Error Handler** — Masks raw database errors from API consumers

---

## 📈 Scalability Notes

| Concern | Strategy |
|---------|----------|
| **Multi-core scaling** | PM2 cluster mode across all CPU threads |
| **Caching** | Redis layer for high-read product endpoints |
| **Load balancing** | Nginx + Docker horizontal scaling |
| **DB performance** | Compound indexing on high-query fields |
| **Microservices** | Modular controllers/routes ready for decoupling |

---


