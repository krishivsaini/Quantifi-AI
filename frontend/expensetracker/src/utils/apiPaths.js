export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_PATHS = {
    AUTH: {
        LOGIN: '/api/v1/auth/login',
        REGISTER: '/api/v1/auth/register',
        GET_USER_INFO: '/api/v1/auth/user'
    },
    DASHBOARD: {
        GET_DATA: '/api/v1/dashboard'
    },
    INCOME: {
        ADD_INCOME: '/api/v1/income/add',
        GET_ALL_INCOME: '/api/v1/income/get',
        UPDATE_INCOME: (income_id) => `/api/v1/income/${income_id}`,
        DELETE_INCOME: (income_id) => `/api/v1/income/${income_id}`,
        DOWNLOAD_INCOME: '/api/v1/income/downloadexcel'
    },
    EXPENSE: {
        ADD_EXPENSE: '/api/v1/expense/add',
        GET_ALL_EXPENSE: '/api/v1/expense/get',
        UPDATE_EXPENSE: (expense_id) => `/api/v1/expense/${expense_id}`,
        DELETE_EXPENSE: (expense_id) => `/api/v1/expense/${expense_id}`,
        DOWNLOAD_EXPENSE: '/api/v1/expense/downloadexcel'
    },
    IMAGE: {
        UPLOAD_IMAGE: '/api/v1/auth/upload-image'
    },
    AI: {
        GET_INSIGHTS: '/api/v1/ai/insights',
        CHAT: '/api/v1/ai/chat',
        SUGGEST_CATEGORY: '/api/v1/ai/suggest-category'
    }
}

