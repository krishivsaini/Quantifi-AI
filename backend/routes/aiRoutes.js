const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getFinancialInsights,
    chatWithAI,
    suggestCategory
} = require('../controllers/aiController');

// All routes require authentication
router.use(protect);

// Get AI-powered financial insights
router.get('/insights', getFinancialInsights);

// Chat with AI about finances
router.post('/chat', chatWithAI);

// Get category suggestion for expense
router.post('/suggest-category', suggestCategory);

module.exports = router;
