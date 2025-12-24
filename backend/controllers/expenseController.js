const user = require("../models/user.model");
const Expense = require("../models/expense.model");
const xlsx = require('xlsx');
// add expense
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;

        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newExpense = new Expense({
            user: userId,
            icon,
            category,
            amount,
            date
        });

        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// get all expense categories
exports.getExpenses = async (req, res) => {
    const userId = req.user.id;
    try {
        const expenses = await Expense.find({ user: userId }).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// delete expense
exports.deleteExpense = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        const expense = await Expense.findOneAndDelete({ _id: id, user: userId });
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// update expense
exports.updateExpense = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        const { icon, category, amount, date } = req.body;

        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const expense = await Expense.findOneAndUpdate(
            { _id: id, user: userId },
            { icon, category, amount, date },
            { new: true }
        );

        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.status(200).json(expense);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// download expenses as excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expenses = await Expense.find({ user: userId }).sort({ date: -1 });

        // prepare data for excel
        const excelData = expenses.map(item => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date
        }));

        // convert json to excel
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(excelData);
        xlsx.utils.book_append_sheet(wb, ws, "Expenses");
        xlsx.writeFile(wb, 'expense_details.xlsx');
        res.download('expense_details.xlsx');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};