import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import storageService from '../services/storage';
import './Header.css';

export default function Header() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userData = storageService.getUserData();
        if (userData) {
            setUsername(userData.username);
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        storageService.clear();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-content">
                <h1 className="header-title">Music Library</h1>
                <div className="user-info">
                    <span>Welcome, {username}</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </div>
        </header>
    );
}