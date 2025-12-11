import React from "react";
import AnimeCard from "./AnimeCard";
import "./AnimeList.css";

export default function AnimeList({ animeList }) {
    return (
        <div className="anime-list-container">
            <ul className="anime-list">
                {animeList.map((anime) => (
                    <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
            </ul>
        </div>
    );
}
