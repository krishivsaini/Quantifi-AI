const express = require('express');
const {
    addExpense,
    getExpenses,
    deleteExpense,
    updateExpense,
    downloadExpenseExcel
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', protect, addExpense);
router.get('/get', protect, getExpenses);
router.put('/:id', protect, updateExpense);
router.delete('/:id', protect, deleteExpense);
router.get('/downloadexcel', protect, downloadExpenseExcel);

module.exports = router;