import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
    return (
        <div className="home">
            <h1>🎌 Welcome to <span>Anime Finder</span></h1>
            <p>
                Explore your favorite anime, see details, and manage your favorites list!
            </p>

            <div className="home-buttons">
                <Link to="/items" className="btn">Browse Anime</Link>
                <Link to="/favorites" className="btn">View Favorites</Link>

            </div>

            <div className="home-image">
                <img src="/statics/NightCity.jpg" alt="anime art" />
            </div>
        </div>
    );
}
