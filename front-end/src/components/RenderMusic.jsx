import { useState } from 'react';
import './RenderMusic.css';

export default function RenderMusic({ title, songs, onSaveToPlaylist }) {
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
                {songs.map((song) => (
                    <div key={song.id} className="music-card">
                        <div className="video-container">
                            {renderVideo(song.youtube_link)}
                        </div>
                        <h3>{song.name} - {song.Artist.username}</h3>
                        <p>Genre: {song.Genre?.name || 'Unknown'}</p>
                        <p>Likes: {song.likes}</p>
                        <button 
                            className="save-to-playlist-btn"
                            onClick={() => onSaveToPlaylist(song)}
                        >
                            Save to Playlist
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}