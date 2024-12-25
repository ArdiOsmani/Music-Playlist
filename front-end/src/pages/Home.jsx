import { useState, useEffect } from 'react';
import Header from './Header';
import Navigation from '../components/Navigation';
import PlaylistView from '../components/PlaylistView';
import './Home.css';
import storageService from '../services/storage';
import RenderMusic from '../components/RenderMusic';

export default function Home() {
    const [music, setMusic] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);
    const [playlistName, setPlaylistName] = useState('');
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [newReleases, setNewReleases] = useState([]);
    const [mostLiked, setMostLiked] = useState([]);
    const [allSongs, setAllSongs] = useState([]);

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

        const fetchAllMusicData = async () => {
            try {
                setLoading(true);
                const [newReleasesData, mostLikedData, allSongsData] = await Promise.all([
                    fetch('http://localhost:8585/music/new-releases').then(res => res.json()),
                    fetch('http://localhost:8585/music/most-liked').then(res => res.json()),
                    fetch('http://localhost:8585/music').then(res => res.json())
                ]);

                setNewReleases(newReleasesData);
                setMostLiked(mostLikedData);
                setAllSongs(allSongsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllMusicData();
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
                await fetchUserPlaylists();
            }
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    };

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

    if (loading) return <div className="home-container">Loading...</div>;
    if (error) return <div className="home-container">Error: {error}</div>;
    return (
        <div>
            <div className="main-container">
                <Navigation 
                    userPlaylists={userPlaylists} 
                    onPlaylistSelect={setSelectedPlaylist}
                    onHomeClick={() => setSelectedPlaylist(null)}
                />
                <main className="content">
                    <Header />

                    {selectedPlaylist ? (
                        <PlaylistView playlist={selectedPlaylist} />
                    ) : (
                        <>
                            <RenderMusic 
                                title="New Releases" 
                                songs={newReleases} 
                                onSaveToPlaylist={handleSaveToPlaylist} 
                            />
                            <RenderMusic 
                                title="Most Liked" 
                                songs={mostLiked} 
                                onSaveToPlaylist={handleSaveToPlaylist} 
                            />
                            <RenderMusic 
                                title="All Songs" 
                                songs={allSongs} 
                                onSaveToPlaylist={handleSaveToPlaylist} 
                            />
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