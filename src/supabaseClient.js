import axios from 'axios';

// Get API configuration from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'https://gemini-clone-yp44.onrender.com/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/sign-in';
        }
        return Promise.reject(error);
    }
);

// Auth methods to replace Supabase auth
export const auth = {
    signUp: async (email, password) => {
        try {
            const response = await apiClient.post('/auth/signup', { email, password });
            const { token, user } = response.data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));
            return { data: { user }, error: null };
        } catch (error) {
            return { data: null, error: error.response?.data || error.message };
        }
    },

    signInWithPassword: async ({ email, password }) => {
        try {
            const response = await apiClient.post('/auth/signin', { email, password });
            const { token, user } = response.data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));
            return { data: { user }, error: null };
        } catch (error) {
            return { data: null, error: error.response?.data || error.message };
        }
    },

    signOut: async () => {
        try {
            await apiClient.post('/auth/signout');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            return { error: null };
        } catch (error) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            return { error: null }; // Always succeed for signout
        }
    },

    getSession: async () => {
        const token = localStorage.getItem('authToken');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                return { data: { session: { user } }, error: null };
            } catch (error) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }
        }
        
        return { data: { session: null }, error: null };
    },

    onAuthStateChange: (callback) => {
        // Simple implementation - in a real app you might use an event system
        const checkAuth = () => {
            const token = localStorage.getItem('authToken');
            const userStr = localStorage.getItem('user');
            
            if (token && userStr) {
                try {
                    const user = JSON.parse(userStr);
                    callback('SIGNED_IN', { user });
                } catch (error) {
                    callback('SIGNED_OUT', null);
                }
            } else {
                callback('SIGNED_OUT', null);
            }
        };

        // Check immediately
        checkAuth();

        // Return unsubscribe function
        return { data: { subscription: { unsubscribe: () => {} } } };
    }
};

// Mock supabase object for compatibility
export const supabase = {
    auth,
    // We'll handle database operations through our API routes
    from: () => ({
        select: () => Promise.reject(new Error('Use API service instead')),
        insert: () => Promise.reject(new Error('Use API service instead')),
        update: () => Promise.reject(new Error('Use API service instead')),
        delete: () => Promise.reject(new Error('Use API service instead'))
    })
};

export { apiClient };
