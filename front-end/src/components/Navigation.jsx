import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import storageService from '../services/storage';
import './Navigation.css';

export default function Navigation({ onPlaylistSelect, onHomeClick }) {
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [activePlaylist, setActivePlaylist] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const userData = storageService.getUserData();
    const isAdmin = userData?.role === 'admin';

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
        navigate(`/playlistpage?name=${playlist.name}`);
    };

    const handleLikesClick = async () => {
        try {
            const response = await fetch('http://localhost:8585/playlists', {
                headers: {
                    'Authorization': `Bearer ${storageService.getUserToken()}`
                }
            });
            if (response.ok) {
                const playlists = await response.json();
                const likesPlaylist = playlists.find(p => p.name === 'Likes');
                
                if (likesPlaylist) {
                    setActivePlaylist('likes');
                    onPlaylistSelect({
                        ...likesPlaylist,
                        isLikedSongs: true
                    });
                } else {
                    onPlaylistSelect({
                        name: 'Likes',
                        songs: [],
                        isLikedSongs: true
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching likes playlist:', error);
        }
    };

    return (
        <nav className="nav-sidebar">
            <div className="nav-section">
                <h3>Menu</h3>
                <ul>
                    <li 
                        className={location.pathname === '/home' ? 'active' : ''} 
                        onClick={() => navigate('/home')}
                    >
                        Home
                    </li>

                    <li 
                        className={location.pathname === '/dashboard' ? 'active' : ''} 
                        onClick={() => navigate('/dashboard')}
                    >
                        Dashboard
                    </li>
                    {isAdmin && (
                        <>
                            <li 
                                className={location.pathname === '/admin' ? 'active' : ''} 
                                onClick={() => navigate('/admin')}
                            >
                                Admin
                            </li>
                            <li 
                                className={location.pathname === '/logs' ? 'active' : ''} 
                                onClick={() => navigate('/logs')}
                            >
                                Logs
                            </li>
                        </>
                    )}
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