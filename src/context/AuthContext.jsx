import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('activelife_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem('activelife_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        // Get response text first to check if it's empty
        const text = await response.text();
        let data;
        
        if (!text) {
            throw new Error(`Login failed with status ${response.status}. Server returned empty response.`);
        }

        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error(`Invalid response from server: ${text.substring(0, 100)}`);
        }

        if (!response.ok) {
            throw new Error(data.message || `Login failed with status ${response.status}`);
        }

        setUser(data.data);
        localStorage.setItem('activelife_user', JSON.stringify(data.data));
        return data.data;
    };

    const register = async (name, email, password) => {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        // Get response text first to check if it's empty
        const text = await response.text();
        let data;
        
        if (!text) {
            throw new Error(`Registration failed with status ${response.status}. Server returned empty response.`);
        }

        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error(`Invalid response from server: ${text.substring(0, 100)}`);
        }

        if (!response.ok) {
            throw new Error(data.message || `Registration failed with status ${response.status}`);
        }

        setUser(data.data);
        localStorage.setItem('activelife_user', JSON.stringify(data.data));
        return data.data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('activelife_user');
    };

    const updateUser = (updates) => {
        const updated = { ...user, ...updates };
        setUser(updated);
        localStorage.setItem('activelife_user', JSON.stringify(updated));
    };

    const updateProfile = async (updates) => {
        if (!user?.id) {
            throw new Error('User not logged in');
        }

        const response = await fetch('/api/user/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, ...updates }),
        });

        const text = await response.text();
        let data;
        
        if (!text) {
            throw new Error(`Update failed with status ${response.status}. Server returned empty response.`);
        }

        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error(`Invalid response from server: ${text.substring(0, 100)}`);
        }

        if (!response.ok) {
            throw new Error(data.message || `Update failed with status ${response.status}`);
        }

        // Update local user state
        const updated = { ...user, ...data.data };
        setUser(updated);
        localStorage.setItem('activelife_user', JSON.stringify(updated));
        return data.data;
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            updateUser,
            updateProfile,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
