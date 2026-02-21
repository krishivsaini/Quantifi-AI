import { HiOutlineHome, HiOutlineCash, HiOutlineCreditCard, HiOutlineLogout, HiOutlineUser } from "react-icons/hi";

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: HiOutlineHome,
        path: "/dashboard"
    },
    {
        id: "02",
        label: "Income",
        icon: HiOutlineCash,
        path: "/income"
    },
    {
        id: "03",
        label: "Expense",
        icon: HiOutlineCreditCard,
        path: "/expense"
    },
    {
        id: "05",
        label: "Logout",
        icon: HiOutlineLogout,
        path: "/logout"
    }
]

// Icon options for transactions (React Icons based)
export const INCOME_ICONS = [
    { id: 'salary', label: 'Salary', icon: 'HiOutlineCash' },
    { id: 'freelance', label: 'Freelance', icon: 'HiOutlineBriefcase' },
    { id: 'investment', label: 'Investment', icon: 'HiOutlineTrendingUp' },
    { id: 'gift', label: 'Gift', icon: 'HiOutlineGift' },
    { id: 'refund', label: 'Refund', icon: 'HiOutlineReceiptRefund' },
    { id: 'other', label: 'Other', icon: 'HiOutlineCurrencyDollar' }
]

export const EXPENSE_ICONS = [
    { id: 'food', label: 'Food', icon: 'HiOutlineShoppingBag' },
    { id: 'transport', label: 'Transport', icon: 'HiOutlineTruck' },
    { id: 'shopping', label: 'Shopping', icon: 'HiOutlineShoppingCart' },
    { id: 'entertainment', label: 'Entertainment', icon: 'HiOutlineFilm' },
    { id: 'bills', label: 'Bills', icon: 'HiOutlineDocumentText' },
    { id: 'health', label: 'Health', icon: 'HiOutlineHeart' },
    { id: 'education', label: 'Education', icon: 'HiOutlineAcademicCap' },
    { id: 'travel', label: 'Travel', icon: 'HiOutlineGlobe' },
    { id: 'other', label: 'Other', icon: 'HiOutlineDotsCircleHorizontal' }
]