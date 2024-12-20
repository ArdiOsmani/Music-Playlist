import { useState, useEffect } from 'react';
import './Home.css';

export default function Home() {
    const [music, setMusic] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to extract YouTube video ID from URL
    const getYouTubeID = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    useEffect(() => {
        // Load YouTube IFrame API
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

    if (loading) return <div className="home-container">Loading...</div>;
    if (error) return <div className="home-container">Error: {error}</div>;

    return (
        <div className="home-container">
            <h1>Music Library</h1>
            <div className="music-grid">
                {music.map((song) => (
                    <div key={song.id} className="music-card">
                        <h3>{song.name}</h3>
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
                        <p>Artist: {song.Artist?.username || 'Unknown'}</p>
                        <p>Genre: {song.Genre?.name || 'Unknown'}</p>
                        <p>Likes: {song.likes}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}