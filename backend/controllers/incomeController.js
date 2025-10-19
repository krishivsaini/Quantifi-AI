const user = require("../models/user.model");
const Income = require("../models/income.model");
const xlsx = require('xlsx');
// add income source
exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, source, amount, date } = req.body;

        if(!source || !amount || !date){
            return res.status(400).json({message: "All fields are required"});
        }

        const newIncome = new Income({
            user: userId,
            icon,
            source,
            amount,
            date
        });

        await newIncome.save();
        res.status(200).json(newIncome);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Internal server error"});
    }
};

// get all income sources
exports.getIncomes = async (req, res) => {
    const userId = req.user.id;
    try{
        const income = await Income.find({user: userId}).sort({date: -1});
        res.status(200).json(income);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Internal server error"});
    }
};

// delete income source
exports.deleteIncome = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        const income = await Income.findOneAndDelete({ _id: id, user: userId });
        if (!income) {
            return res.status(404).json({ message: "Income not found" });
        }
        res.status(200).json({ message: "Income deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// download income sources as excel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({ user: userId }).sort({ date: -1 });
        
        // prepare data for excel
        const excelData = income.map(item => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date
        }));

        // convert json to excel
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(excelData);
        xlsx.utils.book_append_sheet(wb, ws, "Incomes");
        xlsx.writeFile(wb, 'income_details.xlsx');
        res.download('income_details.xlsx');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
