// Category Icons for Expense and Income
// Maps category names to React Icon component names

export const EXPENSE_CATEGORY_ICONS = {
    'Food & Dining': 'food',
    'Transportation': 'car',
    'Shopping': 'cart',
    'Entertainment': 'music',
    'Bills & Utilities': 'lightbulb',
    'Healthcare': 'health',
    'Education': 'book',
    'Travel': 'plane',
    'Groceries': 'basket',
    'Personal Care': 'user',
    'Other': 'dots'
}

export const INCOME_SOURCE_ICONS = {
    'Salary': 'briefcase',
    'Freelance': 'laptop',
    'Investment': 'trending',
    'Business': 'building',
    'Rental': 'home',
    'Gift': 'gift',
    'Bonus': 'star',
    'Interest': 'percent',
    'Dividend': 'chart',
    'Refund': 'refresh',
    'Other': 'cash'
}

// Get expense icon based on category
export const getExpenseIcon = (category) => {
    return EXPENSE_CATEGORY_ICONS[category] || 'cart'
}

// Get income icon based on source
export const getIncomeIcon = (source) => {
    // Try exact match first
    if (INCOME_SOURCE_ICONS[source]) {
        return INCOME_SOURCE_ICONS[source]
    }

    // Try partial match
    const lowerSource = source?.toLowerCase() || ''
    if (lowerSource.includes('salary')) return 'briefcase'
    if (lowerSource.includes('freelance')) return 'laptop'
    if (lowerSource.includes('invest')) return 'trending'
    if (lowerSource.includes('business')) return 'building'
    if (lowerSource.includes('rent')) return 'home'
    if (lowerSource.includes('gift')) return 'gift'
    if (lowerSource.includes('bonus')) return 'star'

    return 'cash'
}

// Expense categories with icons
export const EXPENSE_CATEGORIES = [
    { name: 'Food & Dining', icon: 'food' },
    { name: 'Transportation', icon: 'car' },
    { name: 'Shopping', icon: 'cart' },
    { name: 'Entertainment', icon: 'music' },
    { name: 'Bills & Utilities', icon: 'lightbulb' },
    { name: 'Healthcare', icon: 'health' },
    { name: 'Education', icon: 'book' },
    { name: 'Travel', icon: 'plane' },
    { name: 'Groceries', icon: 'basket' },
    { name: 'Personal Care', icon: 'user' },
    { name: 'Other', icon: 'dots' }
]

// Income sources with icons
export const INCOME_SOURCES = [
    { name: 'Salary', icon: 'briefcase' },
    { name: 'Freelance', icon: 'laptop' },
    { name: 'Investment', icon: 'trending' },
    { name: 'Business', icon: 'building' },
    { name: 'Rental', icon: 'home' },
    { name: 'Gift', icon: 'gift' },
    { name: 'Bonus', icon: 'star' },
    { name: 'Other', icon: 'cash' }
]
