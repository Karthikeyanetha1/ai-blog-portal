# NEXUS.AI - AI-Inspired Full-Stack Blog Portal

NEXUS.AI is a premium, production-ready, full-stack blog platform built with React, TypeScript, Tailwind CSS v4, Framer Motion, Node.js, Express, and MongoDB.

Created specifically for **Gurram Karthikeya** (AI/ML Engineer & Full Stack Developer) to showcase technical write-ups, neural network architectures, and cloud guides.

---

## 🚀 Features

- **Cyberpunk AI Aesthetic**: Sleek glassmorphic panels, glowing neon accents, custom gradients, and micro-interactions.
- **Light & Dark Theme**: Responsive sync saved in localStorage (defaulting to cyber-dark).
- **Auto Database Seeding**: Pre-loaded with professional articles in AI, Machine Learning, Web Dev, and Cloud, including real downloaded images from Unsplash.
- **RESTful API**: Clean Express backend with JWT session authentication, route guards, and Multer file upload integration.
- **Interactive Publications Listing**: Real-time search indexing, category tags filters, sorting algorithms (latest, popular, most liked), and pagination.
- **Single Article Reader**: Custom-styled markdown parsing, floating social share handles, likes toggling, and related publications.
- **Comment Threads**: Secure comment boards with creation and deletion controls.
- **Admin Dashboard**: Chart distribution metrics (views by category, posts metrics), CRUD form wizards (title, content, tags, category, custom featured image upload), and global comment moderations.

---

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Framer Motion (animations) + Lucide (icons)
- **Backend**: Node.js + Express (ES Modules JavaScript)
- **Database**: MongoDB (local or Atlas) via Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens) + Bcryptjs password hashing
- **File Uploads**: Multer disk storage

---

## ⚙️ Project Setup & Installation

### Prerequisites
1. **Node.js** (v18.0.0 or higher recommended)
2. **MongoDB** installed locally (running on `mongodb://127.0.0.1:27017/`) or a MongoDB Atlas URI string.

---

### Step 1: Clone and Navigate
Place the files in your desired workspace folder, for example:
`C:\Users\KARTHIK NETHA\.gemini\antigravity\scratch\ai-blog-portal`

### Step 2: Configure and Start the Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Verify the environmental settings in `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/ai-blog
   JWT_SECRET=karthikeya_ai_ml_blog_secret_key_2026
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```
4. Start the backend developer server:
   ```bash
   npm run dev
   ```
   *(Note: On initial start, the DB connection will automatically download Unsplash images and seed users, blogs, and comments if the database collections are empty).*

---

### Step 3: Configure and Start the Frontend
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite developer server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser at: `http://localhost:5173`

---

## 🔑 Default Seed Credentials

Use these credentials to log in and test features:

### 1. Admin Account (Gurram Karthikeya)
- **Email**: `karthik@example.com`
- **Password**: `password123`
- *Access*: Can read, like, post comments, and access the **Admin Dashboard** to write articles, edit existing posts, and delete comments.

### 2. Standard User Account (Jane Doe)
- **Email**: `jane@example.com`
- **Password**: `password123`
- *Access*: Can read, like, and write comments. Restricted from accessing admin routes.

---

## 🌍 Production Deployment Guide

### Database Setup (MongoDB Atlas)
1. Register on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database cluster and set network access to allow connections (IP `0.0.0.0/0` for cloud hosting).
3. Copy the cluster connection string.
4. Replace `MONGO_URI` in `.env` with the connection string (with user password):
   `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ai-blog?retryWrites=true&w=majority`

### Backend Deploy (e.g., Render, Railway, or Heroku)
1. Set the root deployment directory to `backend/`.
2. Connect your Git repository.
3. Configure the environment variables in the host dashboard corresponding to the `.env` file (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`).
4. Set Build command: `npm install`
5. Set Start command: `node src/app.js`

### Frontend Deploy (e.g., Vercel, Netlify, or Hostinger)
1. Add environmental variable `VITE_API_URL` pointing to your deployed backend URL (e.g., `https://your-backend-api.onrender.com/api`).
2. Set Build command: `npm run build`
3. Set Publish directory: `dist/`
4. Setup routing fallback configuration (e.g., a `vercel.json` redirecting all routes to `index.html` for single-page React applications):
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
