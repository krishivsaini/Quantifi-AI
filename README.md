# Quantifi AI - Smart Expense Tracker

**Quantifi AI** is a modern, full-stack financial management application designed to help users track their income and expenses with ease. It leverages Artificial Intelligence to provide actionable financial insights, categorize transactions automatically, and offer a conversational assistant for financial queries.

## 🚀 Problem & Solution
**The Problem:** Managing personal finances can be tedious, with scattered data and a lack of actionable insights.  
**The Solution:** Quantifi AI centralizes financial tracking, offers real-time analytics, and uses AI to simplify categorization and provide personalized financial advice.

## 🏗 Architecture
The application follows a standard **MERN** (MongoDB, Express, React, Node.js) architecture:
- **Frontend:** React (Vite) SPA hosted on Vercel.
- **Backend:** RESTful API with Node.js & Express hosted on Render.
- **Database:** MongoDB Atlas for persistent data storage.
- **AI Service:** Integration with AI providers (e.g., OpenAI/Gemini) for insights.

## 🛠 Tech Stack

### **Frontend**
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **State Management:** Context API
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Visualization:** Recharts

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **File Handling:** Multer
- **Data Export:** SheetJS (XLSX)

## ✨ Features
- [x] **Secure Authentication:** JWT-based Sign-up/Login & Profile Management.
- [x] **Dashboard & Analytics:** Real-time balance summary and visual spending charts.
- [x] **Transaction Management:** Add, Edit, Delete, and Filter Income/Expenses.
- [x] **AI-Powered Assistant:** Chat interface for financial queries and insights.
- [x] **Smart Categorization:** AI-suggested categories for transactions.
- [x] **Data Export:** Download financial reports as Excel (.xlsx) files.
- [x] **Receipt Uploads:** Attach images to transactions.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas Account
- Git

### Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/krishivsaini/ExpenseTracker.git
    cd ExpenseTracker
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in `backend/`:
    ```env
    PORT=8000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLIENT_URL=http://localhost:5173
    GEMINI_API_KEY=your_ai_api_key
    ```
    Start the server:
    ```bash
    npm start
    ```

3.  **Frontend Setup**
    ```bash
    cd ../frontend/expensetracker
    npm install
    ```
    Start the development server:
    ```bash
    npm run dev
    ```

## 📦 Deployment

### Backend Deployment (Render)
1.  Create a new **Web Service** on [Render](https://render.com).
2.  Connect your repository and set the **Root Directory** to `backend`.
3.  Set **Build Command** to `npm install` and **Start Command** to `npm start`.
4.  Add Environment Variables: `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, and `CLIENT_URL` (set to your frontend URL).

### Frontend Deployment (Vercel)
1.  Import your project on [Vercel](https://vercel.com).
2.  Set the **Root Directory** to `frontend/expensetracker`.
3.  Add Environment Variable: `VITE_API_BASE_URL` (set to your Render backend URL).
4.  Deploy!

## 📂 Project Structure

```
ExpenseTracker/
├── backend/                 # Node.js & Express Server
│   ├── config/              # DB connection
│   ├── controllers/         # Business logic
│   ├── middleware/          # Auth & Upload checks
│   ├── models/              # Mongoose Schemas
│   └── routes/              # API Endpoints
│
└── frontend/expensetracker/ # React Vite Application
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── context/         # Global State
    │   ├── pages/           # Main Views
    │   └── utils/           # Helpers & API setup
```


## 🗺 Roadmap
- [ ] Mobile App (React Native)
- [ ] Budget Planning & Alerts
- [ ] Multi-currency Support
- [ ] Recurring Transactions

## 📄 License
This project is licensed under the MIT License.
