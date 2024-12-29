import { useState, useEffect } from 'react';
import storageService from '../services/storage';
import './RenderMusic.css';

export default function RenderMusic({ title, songs, onSaveToPlaylist }) {
    const [likedSongs, setLikedSongs] = useState(new Set());
    const [localSongs, setLocalSongs] = useState(songs);

    useEffect(() => {
        setLocalSongs(songs);
        fetchLikedSongs();
    }, [songs]);

    const fetchLikedSongs = async () => {
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
                    const likedIds = new Set(likesPlaylist.songs.map(song => song.id));
                    setLikedSongs(likedIds);
                }
            }
        } catch (error) {
            console.error('Error fetching liked songs:', error);
        }
    };

    const handleLike = async (song) => {
        try {
            const response = await fetch(`http://localhost:8585/music/${song.id}/toggle-like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${storageService.getUserToken()}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setLikedSongs(prev => {
                    const newSet = new Set(prev);
                    if (data.liked) {
                        newSet.add(song.id);
                    } else {
                        newSet.delete(song.id);
                    }
                    return newSet;
                });
                
                // Update local song likes count
                setLocalSongs(prev => prev.map(s => 
                    s.id === song.id ? { ...s, likes: data.likes } : s
                ));
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const getYouTubeID = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const renderVideo = (url) => {
        const videoId = getYouTubeID(url);
        if (!videoId) return <div className="video-error">Invalid video URL</div>;

        return (
            <iframe
                width="280"
                height="157"
                src={`https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
            />
        );
    };

    return (
        <div className="music-row">
            <h2>{title}</h2>
            <div className="music-grid">
                {localSongs.map((song) => (
                    <div key={song.id} className="music-card">
                        <div className="video-container">
                            {renderVideo(song.youtube_link)}
                        </div>
                        <h3>{song.name} - {song.Artist.username}</h3>
                        <p>Genre: {song.Genre?.name || 'Unknown'}</p>
                        <div className="song-actions">
                            <button 
                                className={`like-btn ${likedSongs.has(song.id) ? 'liked' : ''}`}
                                onClick={() => handleLike(song)}
                            >
                                {likedSongs.has(song.id) ? '❤️' : '🤍'} {song.likes}
                            </button>
                            <button 
                                className="save-to-playlist-btn"
                                onClick={() => onSaveToPlaylist(song)}
                            >
                                Save to Playlist
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}