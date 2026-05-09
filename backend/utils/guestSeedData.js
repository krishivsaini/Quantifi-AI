// Sample data used to populate the guest demo account.
// Dates are computed relative to "now" so the dashboard's
// last-60-days charts always have data.

const daysAgo = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
};

const incomes = [
    { source: 'Salary',       icon: '💼', amount: 75000, date: daysAgo(2)  },
    { source: 'Salary',       icon: '💼', amount: 75000, date: daysAgo(32) },
    { source: 'Freelance',    icon: '💻', amount: 18000, date: daysAgo(10) },
    { source: 'Freelance',    icon: '💻', amount: 12500, date: daysAgo(40) },
    { source: 'Investments',  icon: '📈', amount:  6200, date: daysAgo(18) },
    { source: 'Dividends',    icon: '💰', amount:  3400, date: daysAgo(48) },
    { source: 'Gift',         icon: '🎁', amount:  2000, date: daysAgo(25) }
];

const expenses = [
    { category: 'Rent',          icon: '🏠', amount: 22000, date: daysAgo(1)  },
    { category: 'Groceries',     icon: '🛒', amount:  4200, date: daysAgo(3)  },
    { category: 'Groceries',     icon: '🛒', amount:  3850, date: daysAgo(17) },
    { category: 'Groceries',     icon: '🛒', amount:  4100, date: daysAgo(34) },
    { category: 'Dining',        icon: '🍽️', amount:  1850, date: daysAgo(5)  },
    { category: 'Dining',        icon: '🍽️', amount:  2400, date: daysAgo(22) },
    { category: 'Transport',     icon: '🚗', amount:  1600, date: daysAgo(7)  },
    { category: 'Transport',     icon: '🚗', amount:  1450, date: daysAgo(28) },
    { category: 'Entertainment', icon: '🎬', amount:  1200, date: daysAgo(9)  },
    { category: 'Entertainment', icon: '🎬', amount:   850, date: daysAgo(36) },
    { category: 'Utilities',     icon: '💡', amount:  2800, date: daysAgo(12) },
    { category: 'Utilities',     icon: '💡', amount:  2950, date: daysAgo(42) },
    { category: 'Shopping',      icon: '🛍️', amount:  3200, date: daysAgo(15) },
    { category: 'Shopping',      icon: '🛍️', amount:  2100, date: daysAgo(45) },
    { category: 'Health',        icon: '🏥', amount:  1800, date: daysAgo(20) },
    { category: 'Subscriptions', icon: '📺', amount:   799, date: daysAgo(4)  },
    { category: 'Subscriptions', icon: '📺', amount:   799, date: daysAgo(34) }
];

module.exports = { incomes, expenses };
