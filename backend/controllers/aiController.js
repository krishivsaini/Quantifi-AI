const Income = require('../models/income.model');
const Expense = require('../models/expense.model');

// Helper function to format currency
const formatCurrency = (amount) => `₹${(amount || 0).toLocaleString('en-IN')}`;

// Lazy-load Gemini to prevent crashes if API key is missing
let genAI = null;
const getGenAI = () => {
    if (!genAI) {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured in environment variables');
        }
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return genAI;
};

// ===========================================
// CACHING SYSTEM
// ===========================================
// Cache stores: { [userId]: { data, timestamp, dataHash } }
const insightsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Generate a hash of financial data to detect changes
const generateDataHash = (incomes, expenses) => {
    const incomeSum = incomes.reduce((acc, curr) => acc + curr.amount, 0);
    const expenseSum = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const incomeCount = incomes.length;
    const expenseCount = expenses.length;
    return `${incomeSum}-${expenseSum}-${incomeCount}-${expenseCount}`;
};

// Check if cache is valid
const isCacheValid = (userId, currentDataHash) => {
    const cached = insightsCache.get(userId);
    if (!cached) return false;

    const now = Date.now();
    const isExpired = (now - cached.timestamp) > CACHE_DURATION;
    const hasDataChanged = cached.dataHash !== currentDataHash;

    return !isExpired && !hasDataChanged;
};

// Get cached data
const getCachedInsights = (userId) => {
    const cached = insightsCache.get(userId);
    return cached ? cached.data : null;
};

// Set cache data
const setCacheInsights = (userId, data, dataHash) => {
    insightsCache.set(userId, {
        data,
        timestamp: Date.now(),
        dataHash
    });
};

// ===========================================
// AI ENDPOINTS
// ===========================================

// Get AI Financial Insights
exports.getFinancialInsights = async (req, res) => {
    try {
        const userId = req.user.id;

        // Check for API key first
        if (!process.env.GEMINI_API_KEY) {
            return res.json({
                success: true,
                insights: [{
                    title: "AI Not Configured",
                    description: "Add your GEMINI_API_KEY to .env file to enable AI insights. Get a free key at makersuite.google.com",
                    type: "info",
                    icon: "key"
                }],
                summary: "Configure your Gemini API key to unlock AI-powered insights!"
            });
        }

        // Fetch user's financial data
        const incomes = await Income.find({ user: userId }).sort({ date: -1 }).limit(50);
        const expenses = await Expense.find({ user: userId }).sort({ date: -1 }).limit(50);

        // Generate data hash to check for changes
        const dataHash = generateDataHash(incomes, expenses);

        // CHECK CACHE - Return cached data if valid
        if (isCacheValid(userId, dataHash)) {
            console.log('Returning cached AI insights for user:', userId);
            return res.json(getCachedInsights(userId));
        }

        const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
        const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const savings = totalIncome - totalExpenses;

        // If no data, return helpful message
        if (incomes.length === 0 && expenses.length === 0) {
            const response = {
                success: true,
                insights: [{
                    title: "Start Tracking!",
                    description: "Add some income and expenses to get personalized AI insights about your financial health.",
                    type: "info",
                    icon: "chart"
                }],
                summary: "Add transactions to unlock AI-powered financial insights!",
                financialSummary: { totalIncome: 0, totalExpenses: 0, savings: 0, savingsRate: 0 },
                cached: false
            };
            setCacheInsights(userId, response, dataHash);
            return res.json(response);
        }

        // Group expenses by category
        const categoryBreakdown = expenses.reduce((acc, expense) => {
            const category = expense.category || 'Other';
            acc[category] = (acc[category] || 0) + expense.amount;
            return acc;
        }, {});

        // Prepare prompt for Gemini
        const prompt = `You are a helpful financial advisor. Analyze this user's financial data and provide 3-4 personalized, actionable insights.

Financial Summary:
- Total Income: ${formatCurrency(totalIncome)}
- Total Expenses: ${formatCurrency(totalExpenses)}
- Net Savings: ${formatCurrency(savings)}
- Savings Rate: ${totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0}%

Expense Breakdown by Category:
${Object.entries(categoryBreakdown).map(([cat, amount]) => `- ${cat}: ${formatCurrency(amount)}`).join('\n') || 'No expenses yet'}

Income Sources:
${incomes.slice(0, 5).map(i => `- ${i.source}: ${formatCurrency(i.amount)}`).join('\n') || 'No income yet'}

Provide insights in this JSON format (respond ONLY with valid JSON, no markdown):
{
  "insights": [
    {
      "title": "Brief title",
      "description": "Detailed insight (2-3 sentences)",
      "type": "tip",
      "icon": "bulb"
    }
  ],
  "summary": "One sentence overall financial health summary"
}`;

        console.log('Calling Gemini API for user:', userId);
        const ai = getGenAI();
        const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse the JSON response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const insights = JSON.parse(jsonMatch[0]);
                const responseData = {
                    success: true,
                    ...insights,
                    financialSummary: {
                        totalIncome,
                        totalExpenses,
                        savings,
                        savingsRate: totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0
                    },
                    cached: false,
                    cacheExpiresIn: '5 minutes'
                };

                // SAVE TO CACHE
                setCacheInsights(userId, responseData, dataHash);

                return res.json(responseData);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
            }
        }

        // Fallback if parsing fails
        const fallbackResponse = {
            success: true,
            insights: [{
                title: "Keep Tracking!",
                description: "Continue logging your income and expenses to get more personalized insights.",
                type: "info",
                icon: "chart"
            }],
            summary: "Keep tracking your finances for better insights!",
            financialSummary: { totalIncome, totalExpenses, savings, savingsRate: totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0 },
            cached: false
        };
        setCacheInsights(userId, fallbackResponse, dataHash);
        return res.json(fallbackResponse);

    } catch (error) {
        console.error('AI Insights Error:', error.message);
        // Return graceful fallback instead of 500
        return res.json({
            success: true,
            insights: [{
                title: "AI Temporarily Unavailable",
                description: error.message.includes('429')
                    ? "Rate limit reached. Please wait a minute before refreshing for AI insights."
                    : error.message.includes('API_KEY')
                        ? "Please add GEMINI_API_KEY to your .env file to enable AI insights."
                        : "We couldn't generate insights right now. Please try again later.",
                type: "warning",
                icon: "warning"
            }],
            summary: "AI insights are temporarily unavailable."
        });
    }
};

// Chat with AI about finances (no caching - each message is unique)
exports.chatWithAI = async (req, res) => {
    try {
        const userId = req.user.id;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        // Check for API key
        if (!process.env.GEMINI_API_KEY) {
            return res.json({
                success: true,
                response: "AI chat is not configured yet. Please add your GEMINI_API_KEY to the backend .env file. You can get a free key at makersuite.google.com"
            });
        }

        // Fetch user's financial context
        const incomes = await Income.find({ user: userId }).sort({ date: -1 }).limit(30);
        const expenses = await Expense.find({ user: userId }).sort({ date: -1 }).limit(30);

        const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
        const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

        // Group expenses by category
        const categoryBreakdown = expenses.reduce((acc, expense) => {
            const category = expense.category || 'Other';
            acc[category] = (acc[category] || 0) + expense.amount;
            return acc;
        }, {});

        const prompt = `You are a friendly AI financial assistant for an expense tracking app. Answer the user's question based on their financial data.

User's Financial Context:
- Total Income: ${formatCurrency(totalIncome)}
- Total Expenses: ${formatCurrency(totalExpenses)}
- Net Balance: ${formatCurrency(totalIncome - totalExpenses)}

Expense Categories:
${Object.entries(categoryBreakdown).map(([cat, amount]) => `- ${cat}: ${formatCurrency(amount)}`).join('\n') || 'No expenses yet'}

Recent Transactions:
${expenses.slice(0, 5).map(e => `- ${e.category}: ${formatCurrency(e.amount)} on ${new Date(e.date).toLocaleDateString()}`).join('\n') || 'No recent transactions'}

User's Question: "${message}"

Provide a helpful, concise response (2-4 sentences). Be friendly and use emojis sparingly. If the question is not related to finances, politely redirect to financial topics.`;

        const ai = getGenAI();
        const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return res.json({
            success: true,
            response: text,
            context: {
                totalIncome,
                totalExpenses,
                balance: totalIncome - totalExpenses
            }
        });

    } catch (error) {
        console.error('AI Chat Error:', error.message);
        return res.json({
            success: true,
            response: error.message.includes('429')
                ? "I'm getting too many requests right now. Please wait a moment and try again! ⏳"
                : "Sorry, I couldn't process that right now. Please make sure your Gemini API key is configured correctly in the .env file. 🔧"
        });
    }
};

// Auto-categorize expense (simple caching for common descriptions)
const categoryCache = new Map();

exports.suggestCategory = async (req, res) => {
    try {
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({ message: "Description is required" });
        }

        // Check category cache first
        const normalizedDesc = description.toLowerCase().trim();
        if (categoryCache.has(normalizedDesc)) {
            return res.json({
                success: true,
                suggestedCategory: categoryCache.get(normalizedDesc),
                cached: true
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.json({ success: true, suggestedCategory: 'Other' });
        }

        const categories = [
            'Food & Dining',
            'Transportation',
            'Shopping',
            'Entertainment',
            'Bills & Utilities',
            'Healthcare',
            'Education',
            'Travel',
            'Groceries',
            'Personal Care',
            'Other'
        ];

        const prompt = `Given this expense description: "${description}"
        
Suggest the most appropriate category from this list: ${categories.join(', ')}

Respond with ONLY the category name, nothing else.`;

        const ai = getGenAI();
        const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const suggestedCategory = response.text().trim();

        // Validate the category
        const validCategory = categories.find(
            cat => cat.toLowerCase() === suggestedCategory.toLowerCase()
        ) || 'Other';

        // Cache the result
        categoryCache.set(normalizedDesc, validCategory);

        return res.json({
            success: true,
            suggestedCategory: validCategory,
            cached: false
        });

    } catch (error) {
        console.error('Category Suggestion Error:', error.message);
        return res.json({
            success: true,
            suggestedCategory: 'Other'
        });
    }
};
