import { useEffect, useState } from 'react';
import axios from 'axios';

// Định nghĩa kiểu dữ liệu cho người dùng
interface User {
    id: number;
    name: string;
    email: string;
    address: string;
    phone: string;
    banned: boolean;
}

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);

    // Lấy dữ liệu từ API khi component mount
    useEffect(() => {
        axios.get('/getusers')
            .then(response => {
                console.log('API Response:', response.data); // Log dữ liệu trả về từ API
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error); // Log lỗi nếu xảy ra
            });
    }, []);

    const toggleBan = (userId: number): void => {
        setUsers(users.map(user => 
            user.id === userId ? { ...user, banned: !user.banned } : user
        ));
    };

    const editUser = (userId: number): void => {
        console.log(`Edit user with ID: ${userId}`);
    };
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Quản lý khách hàng</h2>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 text-center">Tên</th>
                        <th className="py-2 text-center">Email</th>
                        <th className="py-2 text-center">Địa chỉ</th>
                        <th className="py-2 text-center">Số điện thoại</th>
                        <th className="py-2 text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-t">
                            <td className="py-2 text-center">{user.name}</td>
                            <td className="py-2 text-center">{user.email}</td>
                            <td className="py-2 text-center">{user.address}</td>
                            <td className="py-2 text-center">{user.phone}</td>
                            <td className="py-2 text-center">
                                <button 
                                    className={`px-4 py-2 rounded ${user.banned ? 'bg-green-500' : 'bg-red-500'} text-white`}
                                    onClick={() => toggleBan(user.id)}
                                >
                                    {user.banned ? 'Unban' : 'Ban'}
                                </button>
                                <button 
                                    className="px-4 py-2 ml-2 rounded bg-blue-500 text-white"
                                    onClick={() => editUser(user.id)}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
