import { useState, useEffect } from 'react';
import Header from './Header';
import Navigation from '../components/Navigation';
import './Home.css';
import storageService from '../services/storage';

export default function Home() {
    const [music, setMusic] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);
    const [playlistName, setPlaylistName] = useState('');
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    const getYouTubeID = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    useEffect(() => {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        const fetchMusic = async () => {
            try {
                const response = await fetch('http://localhost:8585/music');
                if (!response.ok) {
                    throw new Error('Failed to fetch music');
                }
                const data = await response.json();
                setMusic(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMusic();
    }, []);

    const handleSaveToPlaylist = (song) => {
        setSelectedSong(song);
        setShowPlaylistModal(true);
    };

    const handleCreatePlaylist = async () => {
        if (!playlistName.trim()) {
            return;
        }

        try {
            const response = await fetch('http://localhost:8585/playlists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storageService.getUserToken()}`
                },
                body: JSON.stringify({
                    name: playlistName,
                    songId: selectedSong.id
                })
            });

            if (response.ok) {
                setShowPlaylistModal(false);
                setPlaylistName('');
                // Refresh the navigation to show the new playlist
                await fetchUserPlaylists();
            }
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    };

    // Add this function to fetch user playlists
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

    const renderMusicRow = (title, songs) => (
        <div className="music-row">
            <h2>{title}</h2>
            <div className="music-grid">
                {songs.map((song) => (
                    <div key={song.id} className="music-card">
                        <div className="video-container">
                            <iframe
                                width="280"
                                height="157"
                                src={`https://www.youtube.com/embed/${getYouTubeID(song.youtube_link)}`}
                                title={song.name}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <h3>{song.name}</h3>
                        <p>Artist: {song.Artist?.username || 'Unknown'}</p>
                        <p>Genre: {song.Genre?.name || 'Unknown'}</p>
                        <p>Likes: {song.likes}</p>
                        <button 
                            className="save-to-playlist-btn"
                            onClick={() => handleSaveToPlaylist(song)}
                        >
                            Save to Playlist
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    if (loading) return <div className="home-container">Loading...</div>;
    if (error) return <div className="home-container">Error: {error}</div>;

    const newReleases = music.slice(-4);
    const mostLiked = [...music].sort((a, b) => b.likes - a.likes).slice(0, 4);
    const allSongs = music;

    return (
        <div>
            <div className="main-container">
                <Navigation 
                    userPlaylists={userPlaylists} 
                    onPlaylistSelect={setSelectedPlaylist}
                />
                <main className="content">
                    <Header />
                    {selectedPlaylist ? (
                        <div className="playlist-view">
                            <h2>{selectedPlaylist.name}</h2>
                            <div className="music-grid">
                                {selectedPlaylist.songs.map(song => (
                                    /* Render playlist songs */
                                    <div key={song.id} className="music-card">
                                        {/* Same card content as above */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {renderMusicRow('New Releases', newReleases)}
                            {renderMusicRow('Most Liked', mostLiked)}
                            {renderMusicRow('All Songs', allSongs)}
                        </>
                    )}
                </main>
            </div>

            {showPlaylistModal && (
                <div className="modal-overlay">
                    <div className="playlist-modal">
                        <h3>Create New Playlist</h3>
                        <input
                            type="text"
                            placeholder="Playlist name"
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                        />
                        <div className="modal-buttons">
                            <button onClick={handleCreatePlaylist}>Create</button>
                            <button onClick={() => setShowPlaylistModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}