import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Navigation from '../components/Navigation';
import storageService from '../services/storage';
import './Logs.css';

export default function Logs() {
    const [logs, setLogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = storageService.getUserData();
        if (!userData || userData.role !== 'admin') {
            navigate('/home');
        }
        fetchLogs();
    }, [navigate]);

    const fetchLogs = async () => {
        try {
            const response = await fetch('http://localhost:8585/users/admin-logs', {
                headers: {
                    'Authorization': `Bearer ${storageService.getUserToken()}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Fetched logs:', data);
            setLogs(data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    return (
        <div className="logs-dashboard">
            <div className="main-container">
                <Navigation />
                <main className="content">
                    <Header />
                    <div className="logs-content">
                        <h2>Admin Logs</h2>
                        <div className="logs-container">
                            <table className="logs-table">
                                <thead>
                                    <tr>
                                        <th>Timestamp</th>
                                        <th>Admin</th>
                                        <th>Action</th>
                                        <th>Target User</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs && logs.length > 0 ? (
                                        logs.map(log => (
                                            <tr 
                                                key={log.id} 
                                                data-action={log.action}
                                            >
                                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                                                <td>{log.Admin?.username || 'System'}</td>
                                                <td>{log.action}</td>
                                                <td>{log.TargetUser?.username || 'N/A'}</td>
                                                <td>{log.details}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center' }}>
                                                No logs available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}