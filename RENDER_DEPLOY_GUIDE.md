# 🚀 OMEGA Stationery — Java Spring Boot & MongoDB Render Deployment Guide

This guide walks you through deploying the **Java Spring Boot 3 + MongoDB** backend to **Render**, connecting the live URL to your frontend, and verifying end-to-end functionality.

---

## 🏗️ Architecture Overview

```mermaid
graph LR
    User[Customer Browser] --> Frontend[Vite React Frontend on Vercel / Render]
    Frontend -- HTTP / REST API --> Backend[Java Spring Boot 3 Backend on Render]
    Backend -- Port 8080 --> Health["/api/health (Actuator & Diagnostics)"]
    Backend -- CRUD Operations --> Mongo[(MongoDB Atlas NoSQL Cloud Database)]
```

- **Backend**: Java 21, Spring Boot 3.3.4, Spring Data MongoDB, Docker multi-stage container
- **Database**: MongoDB Atlas (Free M0 Cluster) or local MongoDB
- **Hosting**: Render Cloud (Web Service / Docker)
- **Frontend**: Vite + React 19 + TypeScript, connected via `VITE_BACKEND_URL`

---

## Step 1: Set Up Free MongoDB Atlas Database (2 Minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up / log in.
2. Click **Create Deployment** → Select **M0 (Free)** tier.
3. Choose provider and region (e.g., AWS Frankfurt, Ireland, or Mumbai).
4. In **Database Access**:
   - Create a database user, e.g., `omega_admin` with a secure password.
5. In **Network Access**:
   - Click **Add IP Address** → Choose **Allow Access from Anywhere (`0.0.0.0/0`)** so Render can connect.
6. In **Database** → Click **Connect** → Choose **Drivers (Java)**:
   - Copy your connection string:
     ```
     mongodb+srv://omega_admin:<password>@cluster0.abcde.mongodb.net/omega_stationery?retryWrites=true&w=majority
     ```
   *(Replace `<password>` with your database user password and ensure `/omega_stationery` is the database name)*

---

## Step 2: Deploy to Render

### Method A: Automatic Deployment using Render Blueprint (`render.yaml`)

1. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: Add Java Spring Boot backend with MongoDB & Render configuration"
   git push origin main
   ```
2. Open your [Render Dashboard](https://dashboard.render.com).
3. Click **New +** → **Blueprint**.
4. Select your **OMEGA-Stationery** repository.
5. Render will automatically detect `render.yaml` and configure:
   - Web Service: `omega-stationery-backend` (Docker runtime)
6. Under **Environment Variables**, supply your `MONGODB_URI`:
   ```
   MONGODB_URI = mongodb+srv://omega_admin:YOUR_PASSWORD@cluster0.abcde.mongodb.net/omega_stationery?retryWrites=true&w=majority
   ```
7. Click **Apply**. Render will automatically build the Docker image and deploy your Java backend!

---

### Method B: Manual Web Service Setup on Render

1. Open [Render Dashboard](https://dashboard.render.com) → Click **New +** → **Web Service**.
2. Connect your GitHub repository: `OMEGA-Stationery`.
3. Set the configuration:
   - **Name**: `omega-stationery-backend`
   - **Region**: Frankfurt / Oregon (match your MongoDB Atlas region for fastest latency)
   - **Root Directory**: `backend-java`
   - **Runtime**: `Docker`
   - **Instance Type**: `Free`
4. In **Environment Variables**:
   | Key | Value |
   |---|---|
   | `PORT` | `8080` |
   | `MONGODB_URI` | `mongodb+srv://omega_admin:PASSWORD@cluster0.xxx.mongodb.net/omega_stationery?retryWrites=true&w=majority` |
   | `CORS_ALLOWED_ORIGINS` | `*` |
5. In **Health Check Path**: `/api/health`
6. Click **Create Web Service**.

---

## Step 3: Connect Live Backend URL in Frontend

Once Render completes the build, your live service URL will appear at the top, for example:
```
https://omega-stationery-backend.onrender.com
```

### Local Development:
Open `.env` in the project root and set:
```ini
VITE_BACKEND_URL=https://omega-stationery-backend.onrender.com
```
*(Or use `http://localhost:8080` if running Spring Boot locally)*

### Production Frontend (Vercel or Render):
1. Go to your frontend hosting dashboard (Vercel / Render Static Site).
2. Go to **Settings** → **Environment Variables**.
3. Add or update:
   - **Key**: `VITE_BACKEND_URL`
   - **Value**: `https://omega-stationery-backend.onrender.com`
4. Redeploy the frontend.

---

## Step 4: Verify Deployment & MongoDB Auto-Seeding

1. Open your browser and visit:
   ```
   https://omega-stationery-backend.onrender.com/api/health
   ```
   You will receive a real-time JSON diagnostics response:
   ```json
   {
     "success": true,
     "message": "OMEGA Java Backend is operating normally",
     "data": {
       "status": "UP",
       "service": "OMEGA Stationery Java Backend",
       "runtime": "Java 21.0.12",
       "database": {
         "engine": "MongoDB",
         "connected": true,
         "productsCount": 22,
         "ordersCount": 0,
         "databaseName": "omega_stationery"
       }
     }
   }
   ```
2. Visit `https://omega-stationery-backend.onrender.com/api/products` to see all 22+ OMEGA catalog items loaded directly from MongoDB!
3. Open the website, scroll to the footer, and click the **"Backend & DB"** status pill to see live connection details in the modal.

---

## REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Live diagnostic check & MongoDB connection status |
| `GET` | `/api/products` | Retrieve catalog (supports `?category=`, `?search=`, `?featured=true`) |
| `GET` | `/api/products/{id}` | Retrieve single product by ID or SKU |
| `POST` | `/api/products` | Create a new product in MongoDB |
| `PUT` | `/api/products/{id}` | Update product details / stock / price |
| `DELETE`| `/api/products/{id}` | Delete product |
| `POST` | `/api/orders` | Submit new customer enquiry / order to MongoDB |
| `GET` | `/api/orders` | List all orders stored in MongoDB |
| `GET` | `/api/orders/{reference}` | Retrieve order by reference (e.g. `OMG-ORD-...`) |
| `PATCH`| `/api/orders/{id}/status` | Update order status (`CONFIRMED`, `DISPATCHED`, etc.) |
