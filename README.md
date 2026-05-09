# Quantifi AI — Smart Expense Tracker

**Quantifi AI** is a full-stack personal finance application that helps users track income and expenses, visualize spending patterns, and receive AI-powered financial insights. Built on the MERN stack with Google Gemini integration.

**Live Demo:** [https://quantifi-ai.vercel.app](https://quantifi-ai.vercel.app)

## Try the Demo

Reviewers can explore the application without creating an account. From the login page, click **Continue as Guest** to enter a pre-populated demo dashboard containing sample income and expense records spanning the last 60 days. Demo data is reset on every guest login, and any changes made in the demo session do not affect real user accounts.

## Overview

Managing personal finances is often hindered by scattered records and a lack of actionable insights. Quantifi AI centralizes financial tracking, surfaces real-time analytics, and uses generative AI to assist with categorization, summarization, and conversational financial queries.

## Architecture

The application follows a standard MERN architecture:

- **Frontend:** React (Vite) single-page application deployed on Vercel.
- **Backend:** RESTful API built with Node.js and Express, deployed on Render.
- **Database:** MongoDB Atlas for persistent storage.
- **AI Service:** Google Gemini (`gemini-2.5-flash`) for insights, chat, and category suggestions.

## Tech Stack

**Frontend**
- React.js (Vite)
- Tailwind CSS
- Context API for state management
- React Router DOM
- Axios
- Recharts

**Backend**
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JSON Web Tokens (JWT) for authentication
- Multer for file uploads
- SheetJS (XLSX) for data export

## Features

- **Secure Authentication** — JWT-based sign-up, login, and profile management.
- **Guest Demo Mode** — One-click access to a pre-populated demo account; no signup required.
- **Dashboard & Analytics** — Real-time balance summary and visual spending charts.
- **Transaction Management** — Add, edit, delete, and filter income and expense records.
- **AI-Powered Insights** — Personalized financial analysis powered by Google Gemini.
- **AI Chat Assistant** — Conversational interface for financial queries grounded in the user's data.
- **Smart Categorization** — AI-suggested categories for new transactions.
- **Global Search** — Quickly find any transaction by source, category, or amount.
- **Dark and Light Modes** — Theme toggle with system-aware styling.
- **Data Export** — Download financial reports as Excel (.xlsx) files.
- **Receipt Uploads** — Attach images to transactions.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### Setup and Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/krishivsaini/ExpenseTracker.git
   cd ExpenseTracker
   ```

2. **Backend setup**

   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the `backend/` directory:

   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

   A free Gemini API key can be obtained at [makersuite.google.com](https://makersuite.google.com).

   Start the server:

   ```bash
   npm start
   ```

3. **Frontend setup**

   ```bash
   cd ../frontend/expensetracker
   npm install
   npm run dev
   ```

## Deployment

### Backend (Render)

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect the repository and set the **Root Directory** to `backend`.
3. Set the **Build Command** to `npm install` and the **Start Command** to `npm start`.
4. Add the environment variables: `MONGO_URI`, `JWT_SECRET`, and `GEMINI_API_KEY`.

### Frontend (Vercel)

1. Import the project into [Vercel](https://vercel.com).
2. Set the **Root Directory** to `frontend/expensetracker`.
3. Add the environment variable `VITE_API_BASE_URL`, set to the deployed Render backend URL.
4. Deploy.

## Project Structure

```
ExpenseTracker/
├── backend/                 # Node.js and Express server
│   ├── config/              # Database connection
│   ├── controllers/         # Business logic
│   ├── middleware/          # Authentication and upload checks
│   ├── models/              # Mongoose schemas
│   └── routes/              # API endpoints
│
└── frontend/expensetracker/ # React (Vite) application
    └── src/
        ├── components/      # Reusable UI components
        ├── context/         # Global state
        ├── pages/           # Main views
        └── utils/           # Helpers and API configuration
```

## License

This project is licensed under the MIT License.
