import React, { useState } from 'react';
import axios from 'axios';

interface EditUserManagementProps {
    user: {
        id: number;
        name: string;
        address: string;
        phone: string;
    };
    onClose: () => void;
}

const EditUserManagement: React.FC<EditUserManagementProps> = ({ user, onClose }) => {
    const [name, setName] = useState(user.name);
    const [address, setAddress] = useState(user.address);
    const [phone, setPhone] = useState(user.phone);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put('/updateusersbyadmin', {
                id: user.id,
                name,
                address,
                phone,
            });
            alert('User updated successfully!');
            onClose();
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user.');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2 className="text-xl font-bold mb-4">Edit User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Address</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="form-textarea"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Phone</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-500 text-white rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserManagement;
