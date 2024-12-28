import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Navigation from '../components/Navigation';
import storageService from '../services/storage';
import './PlaylistPage.css';

export default function PlaylistPage() {
    const [playlist, setPlaylist] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const playlistName = new URLSearchParams(location.search).get('name');
        if (playlistName) {
            fetchPlaylist(playlistName);
        }
    }, [location]);

    const fetchPlaylist = async (playlistName) => {
        try {
            const response = await fetch('http://localhost:8585/playlists', {
                headers: {
                    'Authorization': `Bearer ${storageService.getUserToken()}`
                }
            });
            if (response.ok) {
                const playlists = await response.json();
                const selectedPlaylist = playlists.find(p => p.name === playlistName);
                if (selectedPlaylist) {
                    setPlaylist(selectedPlaylist);
                }
            }
        } catch (error) {
            console.error('Error fetching playlist:', error);
        }
    };

    const renderVideo = (url) => {
        if (!url) return <div className="video-error">Invalid video URL</div>;
        return (
            <iframe
                width="280"
                height="157"
                src={url.replace("watch?v=", "embed/")}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
            />
        );
    };

    return (
        <div className="playlist-page">
            <div className="main-container">
                <Navigation />
                <main className="content">
                    <Header />
                    <div className="playlists-content">
                        {playlist ? (
                            <>
                                <h2>{playlist.name}</h2>
                                <div className="songs-grid">
                                    {playlist.songs.map(song => (
                                        <div key={song.id} className="song-card">
                                            <div className="video-container">
                                                {renderVideo(song.youtube_link)}
                                            </div>
                                            <div className="song-info">
                                                <h4>{song.name}</h4>
                                                <p>Artist: {song.Artist?.username || 'Unknown'}</p>
                                                <p>Genre: {song.Genre?.name || 'Unknown'}</p>
                                                <p>Likes: {song.likes}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="empty-playlist">
                                <p>No playlist selected</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}