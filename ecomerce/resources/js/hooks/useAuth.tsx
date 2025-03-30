import { useState, useEffect } from 'react';

export const useAuth = () => {
    interface User {
        name: string;
        is_admin: boolean;
    }

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Giả lập lấy thông tin user từ API hoặc localStorage
        setUser({ name: "John Doe", is_admin: false });
    }, []);

    return { user };
};
