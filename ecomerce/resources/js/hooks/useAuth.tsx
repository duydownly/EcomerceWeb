import { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API requests

export const useAuth = () => {
    interface User {
        id: string;
        name: string;
        is_admin: boolean;
    }

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/getusers');
                const userData = response.data[0]; // Assuming the first user is the authenticated user
                setUser(userData);
                localStorage.setItem('user_id', userData.id); // Store user_id in local storage
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, []);

    return { user };
};
