import { useState, useEffect } from 'react';
import './PlaylistView.css';

export default function PlaylistView({ playlist }) {
    const getYouTubeID = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (!playlist) return <div className="playlist-view empty">No playlist selected</div>;

    return (
        <div className="playlist-view">
            <h2>{playlist.name}</h2>
            {playlist.songs && playlist.songs.length > 0 ? (
                <div className="music-grid">
                    {playlist.songs.map((song) => (
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
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-playlist">
                    <p>No songs in this playlist</p>
                </div>
            )}
        </div>
    );
}