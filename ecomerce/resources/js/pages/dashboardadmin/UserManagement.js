import { useState } from 'react';

const UserManagement = () => {
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', address: '123 Main St', phone: '123-456-7890', banned: false },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', address: '456 Oak St', phone: '987-654-3210', banned: false },
        // ...other users
    ]);

    const toggleBan = (userId) => {
        setUsers(users.map(user => 
            user.id === userId ? { ...user, banned: !user.banned } : user
        ));
    };

    const editUser = (userId) => {
        // Logic to edit user details
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
                    {users.map(user => (
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
