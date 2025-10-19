const Income = require('../models/income.model');
const Expense = require('../models/expense.model');

const { isValidObjectId ,Types } = require('mongoose');

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(userId);

        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        console.log("Total Income", {totalIncome, userId: isValidObjectId(userId)});

        const totalExpense = await Expense.aggregate([
            { $match: { user: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        // Get last 60 days income transactions
        const last60daysIncomeTransactions = await Income.find({
            user: userObjectId,
            date: { $gte: new Date(Date.now() - 60*24*60*60*1000) }
        }).sort({ date: -1 });

        // get total income for last 60 days
        const incomeLast60Days = last60daysIncomeTransactions.reduce((acc, curr) => acc + curr.amount, 0);

        // Get last 60 days expense transactions
        const last60daysExpenseTransactions = await Expense.find({
            user: userObjectId,
            date: { $gte: new Date(Date.now() - 60*24*60*60*1000) }
        }).sort({ date: -1 });

        // get total expense for last 60 days
        const expenseLast60Days = last60daysExpenseTransactions.reduce((acc, curr) => acc + curr.amount, 0);

        // fetch last 5 transactions (income + expense)
        const lastTransactions = [
            ...((await Income.find({ user: userObjectId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: 'income',
                })
            )),
            ...((await Expense.find({ user: userObjectId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: 'expense',
                })
            ))
        ].sort((a, b) => b.date - a.date)

        res.json({
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpenses: totalExpense[0]?.total || 0,
            last60DaysExpenses: {
                total: expenseLast60Days,
                transactions: last60daysExpenseTransactions,
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60daysIncomeTransactions,
            },
            recentTransactions: lastTransactions,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}