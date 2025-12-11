import React from "react";
import "./AnimeCard.css";
import { Link } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";

export default function AnimeCard({ anime }) {
    const { isFavorite, toggle } = useFavorites();
    const id = `/items/${anime.mal_id}`;

    const liked = isFavorite(anime.mal_id);

    return (
        <div className="anime-card">
            <img
                src={anime.images?.jpg?.image_url}
                alt={anime.title}
                className="anime-image"
            />

            <div className="anime-info">
                <h3>{anime.title}</h3>
                <p>⭐ Score: {anime.score || "N/A"}</p>
            </div>

            <div className="card-footer">
                <a
                    href={anime.url}
                    target="_blank"
                    rel="noreferrer"
                    className="more-info"
                >
                    More info
                </a>

                <button
                    className={`like-button ${liked ? "liked" : ""}`}
                    onClick={() => toggle(anime)}
                    aria-label="Add to favorites"
                >
                    {liked ? "❤️" : "🤍"}
                </button>

                <Link to={id} className="btn">Details</Link>
            </div>
        </div>
    );
}
