
# 🏆 Leaderboard Application

A full-stack leaderboard system where users can:
- Add participants
- Claim points
- View dynamic leaderboards
- Track point claim history

---

## ✅ Live Links
- **Frontend (Netlify):** [https://leaderboard-project1003.netlify.app](https://leaderboard-project1003.netlify.app)  
- **Backend (Render):** [https://leaderboard-project-rgpj.onrender.com](https://leaderboard-project-rgpj.onrender.com)

---

## ✅ Tech Stack
- **Frontend:** React.js, Axios, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)

---

## ✅ Features
- Add and manage users
- Claim points with real-time leaderboard updates
- View user-specific claim history
- Dark/Light mode toggle
- Animated podium for top 3 users
- Confetti effect for rank changes

---

## ✅ Deployment Details

### **Frontend (Netlify)**
- **Build Command:**
  ```bash
  npm run build
  ```
- **Publish Directory:**
  ```
  frontend/build
  ```

### **Backend (Render)**
- **Start Command:**
  ```bash
  node server.js
  ```
- **Environment Variables:**
  ```
  MONGO_URI=your-mongodb-connection-uri
  PORT=10000
  ```

---

## ✅ Database
- **MongoDB Atlas** is used as the database.
- The connection string is stored in the backend `.env` file as:
  ```
  MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/leaderboard
  ```
  

## ✅ API Endpoints
Base URL:
```
https://leaderboard-project-rgpj.onrender.com/api
```

| Endpoint                     | Method | Description              |
|-----------------------------|--------|--------------------------|
| `/api/users/add`           | POST   | Add a new user          |
| `/api/users/leaderboard`   | GET    | Get leaderboard data    |
| `/api/claims/claim`        | POST   | Claim points for a user |
| `/api/claims/history/:id`  | GET    | Get claim history       |

---

## ✅ How to Run Locally
```bash
# Clone repository
git clone https://github.com/spinola103/leaderboard-project.git
cd leaderboard-project

# Install backend dependencies
cd backend
npm install
node server.js

# Install frontend dependencies
cd ../frontend
npm install
npm start
```
Access at: **http://localhost:3000**

---

## ✅ Folder Structure
```
leaderboard-project/
├── backend/      # Node.js + Express API
├── frontend/     # React frontend
└── README.md
```

---

### 👤 Author
**Spinola Theres N**
