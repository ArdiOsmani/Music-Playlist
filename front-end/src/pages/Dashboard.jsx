import { useState, useEffect } from 'react';
import Header from './Header';
import Navigation from '../components/Navigation';
import storageService from '../services/storage';
import './Dashboard.css';

export default function Dashboard() {
    const [newMusic, setNewMusic] = useState({
        name: '',
        youtube_link: '',
        genre_id: ''
    });
    const [userMusic, setUserMusic] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editingMusic, setEditingMusic] = useState(null);

    useEffect(() => {
        fetchUserMusic();
    }, []);

    const fetchUserMusic = async () => {
        try {
            const response = await fetch('http://localhost:8585/music/user', {
                headers: {
                    'Authorization': `Bearer ${storageService.getUserToken()}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUserMusic(data);
            }
        } catch (error) {
            console.error('Error fetching user music:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMusic(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8585/music', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storageService.getUserToken()}`
                },
                body: JSON.stringify(newMusic)
            });

            if (response.ok) {
                const data = await response.json();
                setUserMusic(prev => [...prev, data]);
                setNewMusic({ name: '', youtube_link: '', genre_id: '' });
            }
        } catch (error) {
            console.error('Error creating music:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8585/music/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${storageService.getUserToken()}`
                }
            });

            if (response.ok) {
                setUserMusic(prev => prev.filter(music => music.id !== id));
            }
        } catch (error) {
            console.error('Error deleting music:', error);
        }
    };

    const handleEdit = (music) => {
        setEditingMusic(music);
        setEditMode(true);
        setNewMusic({
            name: music.name,
            youtube_link: music.youtube_link,
            genre_id: music.genre_id
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8585/music/${editingMusic.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storageService.getUserToken()}`
                },
                body: JSON.stringify(newMusic)
            });

            if (response.ok) {
                const updatedMusic = await response.json();
                setUserMusic(prev => prev.map(music => 
                    music.id === editingMusic.id ? updatedMusic : music
                ));
                setEditMode(false);
                setEditingMusic(null);
                setNewMusic({ name: '', youtube_link: '', genre_id: '' });
            }
        } catch (error) {
            console.error('Error updating music:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="main-container">
                <Navigation 
                    onPlaylistSelect={setSelectedPlaylist}
                    onHomeClick={() => setSelectedPlaylist(null)}
                />
                <main className="content">
                    <Header />
                    <div className="dashboard-content">
                        <section className="add-music-section">
                            <h2>{editMode ? 'Update Music' : 'Add New Music'}</h2>
                            <form onSubmit={editMode ? handleUpdate : handleSubmit} className="music-form">
                                <div className="form-group">
                                    <label htmlFor="name">Song Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newMusic.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="youtube_link">YouTube Link</label>
                                    <input
                                        type="url"
                                        id="youtube_link"
                                        name="youtube_link"
                                        value={newMusic.youtube_link}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="genre_id">Genre</label>
                                    <select
                                        id="genre_id"
                                        name="genre_id"
                                        value={newMusic.genre_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Genre</option>
                                        <option value="1">Rock</option>
                                        <option value="2">Pop</option>
                                        <option value="3">Jazz</option>
                                        <option value="4">Classical</option>
                                        <option value="5">Hip Hop</option>
                                    </select>
                                </div>
                                <div className="form-buttons">
                                    <button type="submit" className="submit-btn">
                                        {editMode ? 'Update Music' : 'Add Music'}
                                    </button>
                                    {editMode && (
                                        <button 
                                            type="button" 
                                            className="cancel-btn"
                                            onClick={() => {
                                                setEditMode(false);
                                                setEditingMusic(null);
                                                setNewMusic({ name: '', youtube_link: '', genre_id: '' });
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </section>

                        <section className="music-list-section">
                            <h2>Your Music</h2>
                            <div className="music-grid">
                                {userMusic.map(music => (
                                    <div key={music.id} className="music-card">
                                        <div className="music-info">
                                            <h3>{music.name}</h3>
                                            <p>Genre: {music.Genre?.name || 'Unknown'}</p>
                                            <p>Likes: {music.likes}</p>
                                            <a 
                                                href={music.youtube_link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="youtube-link"
                                            >
                                                Watch on YouTube
                                            </a>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(music.id)}
                                            className="delete-btn"
                                        >
                                            Delete
                                        </button>
                                        <button 
                                            onClick={() => handleEdit(music)}
                                            className="edit-btn"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}