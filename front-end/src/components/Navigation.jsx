import './Navigation.css';

export default function Navigation() {
    return (
        <nav className="nav-sidebar">
            <div className="nav-section">
                <h3>Menu</h3>
                <ul>
                    <li className="active">Home</li>
                    <li>My Playlists</li>
                    <li>Liked Songs</li>
                </ul>
            </div>
            <div className="nav-section">
                <h3>Library</h3>
                <ul>
                    <li>New Releases</li>
                    <li>Most Popular</li>
                    <li>All Songs</li>
                </ul>
            </div>
        </nav>
    );
}