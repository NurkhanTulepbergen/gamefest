import React from "react";
import { useFavorites } from "../hooks/useFavorites";
import AnimeList from "../components/AnimeList";
import "../components/AnimeList.css";

export default function Favorites() {
    const { favorites } = useFavorites();

    return (
        <div className="favorites-page">
            <h1>❤️ Your Favorites</h1>

            {favorites.length > 0 ? (
                <AnimeList animeList={favorites} />
            ) : (
                <p>No favorites yet!</p>
            )}
        </div>
    );
}
