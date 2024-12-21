import { useEffect, useState } from 'react';
import './Navigation.css';

export default function Navigation({ onPlaylistSelect }) {
    const [userPlaylists, setUserPlaylists] = useState([]);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await fetch('http://localhost:8585/playlists', {
                    headers: {
                        'Authorization': `Bearer ${storageService.getUserToken()}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserPlaylists(data);
                }
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };

        fetchPlaylists();
    }, []);

    return (
        <nav className="nav-sidebar">
            <div className="nav-section">
                <h3>Menu</h3>
                <ul>
                    <li onClick={() => onPlaylistSelect(null)}>Home</li>
                </ul>
            </div>
            {userPlaylists.length > 0 && (
                <div className="nav-section">
                    <h3>My Playlists</h3>
                    <ul>
                        {userPlaylists.map(playlist => (
                            <li 
                                key={playlist.id}
                                onClick={() => onPlaylistSelect(playlist)}
                            >
                                {playlist.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </nav>
    );
}