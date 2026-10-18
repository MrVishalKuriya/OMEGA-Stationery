# 🚀 OMEGA Stationery — High-Performance Node.js & MongoDB Render Deployment Guide

This guide walks you through deploying the high-performance **Node.js + MongoDB Atlas + Redis + AI** backend to **Render**, connecting the live URL to your frontend, and verifying end-to-end functionality.

---

## 🏗️ Architecture Overview

```mermaid
graph LR
    User[Customer Browser] --> Frontend[Vite React Frontend on Render]
    Frontend -- HTTP / REST API --> Backend[High-Performance Node.js Backend on Render]
    Backend -- Port 5000 --> Health["/api/health (Diagnostics & Cache Metrics)"]
    Backend -- CRUD Operations --> Mongo[(MongoDB Atlas Cloud Cluster)]
    Backend -- AI Advisor --> AI[(MongoDB AI Model Endpoint)]
```

- **Backend**: Node.js (v20+), Express, Mongoose, Helmet (Security), Compression, Morgan (Logger), Zod validation, Express Rate-Limit
- **Database**: MongoDB Atlas Cluster
- **AI Engine**: MongoDB AI API Model (`https://ai.mongodb.com`) + NLP fallback
- **Hosting**: Render Cloud (Native Node.js Web Service)
- **Frontend**: Vite + React 19 + TypeScript, connected via `VITE_BACKEND_URL`

---

## Step 1: Set Up Free MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in.
2. In **Network Access**:
   - Ensure your IP or `0.0.0.0/0` (Allow from anywhere) is whitelisted so Render web services can connect.
3. In **Database** → Click **Connect** → Choose **Drivers (Node.js)**:
   - Your connection string is:
     ```
     mongodb+srv://indigoprinteromega07_db_user:OMEGA%407016@omega.ccgcbcy.mongodb.net/omega_stationery?retryWrites=true&w=majority
     ```

---

## Step 2: Deploy to Render

### Method A: Automatic Deployment using Render Blueprint (`render.yaml`)

1. Push your repository to GitHub.
2. Open your [Render Dashboard](https://dashboard.render.com).
3. Click **New +** → **Blueprint**.
4. Select your **OMEGA-Stationery** repository.
5. Render detects `render.yaml` and deploys both services automatically:
   - **`omega-stationery-backend`**: Node.js Web Service on port 5000.
   - **`omega-stationery-frontend`**: Static Web Site.

### Method B: Manual Web Service Setup

1. In Render, click **New +** → **Web Service**.
2. Connect your repository.
3. Settings:
   - **Name**: `omega-stationery-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.mjs`
4. Add Environment Variables:
   - `PORT`: `5000`
   - `MONGODB_URI`: your MongoDB Atlas URI
   - `MONGODB_AI_ENDPOINT`: `https://ai.mongodb.com`
   - `MONGODB_AI_API_KEY`: `al-VPCnW0f05wrvNC9EBX63MS0V2E8Fmv4WqN78ueb53U8`
5. Click **Create Web Service**.

---

## Step 3: Verify Backend

Once deployed, visit your Render URL:
```
https://omega-stationery-backend.onrender.com/api/health
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "status": "UP",
    "service": "OMEGA Stationery High-Performance API",
    "runtime": "Node.js v24.21.0",
    "database": {
      "engine": "MongoDB Atlas",
      "connected": true,
      "productsCount": 33
    }
  }
}
```
