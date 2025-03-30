import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import EditUserManagement from './EditUserManagement';

Modal.setAppElement('body'); // Cấu hình modal cho React

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
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);

    useEffect(() => {
        axios.get('/getusers')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const toggleBan = (userId: number, userName: string, isBanned: boolean) => {
        const action = isBanned ? 'unban' : 'ban';
        if (!window.confirm(`Are you sure you want to ${action} user "${userName}" (ID: ${userId})?`)) return;

        const endpoint = isBanned ? '/updatebannedusersfalse' : '/updatebanneduserstrue';
        axios.post(endpoint, { id: userId })
            .then(() => {
                setUsers(users.map(user => 
                    user.id === userId ? { ...user, banned: !user.banned } : user
                ));
            })
            .catch(error => console.error(`Error updating ban status:`, error));
    };
    const fetchUsers = () => {
        axios.get('/getusers')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching users:', error));
    };
    
    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setEditModalIsOpen(true);
    };

    const closeEditModal = () => {
        setEditModalIsOpen(false);
        setSelectedUser(null);
        fetchUsers(); // Gọi lại API để cập nhật danh sách user
    };
    
    useEffect(() => {
        fetchUsers();
    }, []);
    
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
                                    onClick={() => toggleBan(user.id, user.name, user.banned)}
                                >
                                    {user.banned ? 'Unban' : 'Ban'}
                                </button>
                                <button 
                                    className="px-4 py-2 ml-2 rounded bg-blue-500 text-white"
                                    onClick={() => openEditModal(user)}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal chỉnh sửa User */}
            <Modal 
                isOpen={editModalIsOpen} 
                onRequestClose={closeEditModal} 
                contentLabel="Edit User"
                style={{ content: { width: '50%', margin: 'auto' } }}
            >
                {selectedUser && (
                    <EditUserManagement user={selectedUser} onClose={closeEditModal} />
                )}
            </Modal>
        </div>
    );
};

export default UserManagement;
