import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Navigation from '../components/Navigation';
import storageService from '../services/storage';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = storageService.getUserData();
        if (!userData || userData.role !== 'admin') {
            navigate('/home');
        }
        fetchUsers();
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8585/users', {
                headers: {
                    'Authorization': `Bearer ${storageService.getUserToken()}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleEdit = (user) => {
        setSelectedUser({
            ...user,
            password: '' 
        });
        setEditMode(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {

            const updateData = {
                username: selectedUser.username,
                role: selectedUser.role || 'user' 
            };
            
            console.log('Updating user:', selectedUser.id, 'with data:', updateData);

            const response = await fetch(`http://localhost:8585/users/${selectedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storageService.getUserToken()}`
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();
            
            if (response.ok) {
                setUsers(prev => prev.map(user => 
                    user.id === selectedUser.id ? {...user, ...updateData} : user
                ));
                setEditMode(false);
                setSelectedUser(null);
            } else {
                throw new Error(data.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert(error.message);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`http://localhost:8585/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${storageService.getUserToken()}`
                }
            });

            if (response.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="admin-dashboard">
            <div className="main-container">
                <Navigation />
                <main className="content">
                    <Header />
                    <div className="admin-content">
                        <h2>User Management</h2>
                        <div className="users-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.username}</td>
                                            <td>{user.role}</td>
                                            <td>
                                                <button 
                                                    className="edit-btn"
                                                    onClick={() => handleEdit(user)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="delete-btn"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {editMode && selectedUser && (
                            <div className="modal-overlay">
                                <div className="edit-modal">
                                    <h3>Edit User</h3>
                                    <form onSubmit={handleUpdate}>
                                        <div className="form-group">
                                            <label>Username</label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={selectedUser.username}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Password</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={selectedUser.password}
                                                onChange={handleInputChange}
                                                placeholder="Leave blank to keep current password"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Role</label>
                                            <select
                                                name="role"
                                                value={selectedUser.role}
                                                onChange={handleInputChange}
                                            >
                                                <option value="user">User</option>
                                                <option value="artist">Artist</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                        <div className="modal-buttons">
                                            <button type="submit" className="save-btn">
                                                Save Changes
                                            </button>
                                            <button 
                                                type="button" 
                                                className="cancel-btn"
                                                onClick={() => {
                                                    setEditMode(false);
                                                    setSelectedUser(null);
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}