import { useEffect, useState } from 'react';
import storageService from '../services/storage';
import './Navigation.css';

export default function Navigation({ onPlaylistSelect, onHomeClick }) {
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [activePlaylist, setActivePlaylist] = useState(null);

    useEffect(() => {
        fetchUserPlaylists();
    }, []);

    const fetchUserPlaylists = async () => {
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

    const handlePlaylistClick = (playlist) => {
        setActivePlaylist(playlist.id);
        onPlaylistSelect(playlist);
    };

    const handleHomeClick = () => {
        setActivePlaylist(null);
        onHomeClick();
    };

    return (
        <nav className="nav-sidebar">
            <div className="nav-section">
                <h3>Menu</h3>
                <ul>
                    <li 
                        className={!activePlaylist ? 'active' : ''} 
                        onClick={handleHomeClick}
                    >
                        Home
                    </li>
                </ul>
            </div>
            {userPlaylists.length > 0 && (
                <div className="nav-section">
                    <h3>My Playlists</h3>
                    <ul>
                        {userPlaylists.map(playlist => (
                            <li 
                                key={playlist.id}
                                className={activePlaylist === playlist.id ? 'active' : ''}
                                onClick={() => handlePlaylistClick(playlist)}
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