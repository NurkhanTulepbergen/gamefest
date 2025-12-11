// src/pages/GalleryPage.jsx
import { useSelector } from "react-redux";
import LazyImage from "../components/LazyImage";

export default function GalleryPage() {
    const { list, loadingList } = useSelector((state) => state.items);

    return (
        <div className="gallery-page">
            <h1 className="gallery-title">Anime Gallery</h1>

            {/* Если всё ещё грузим список — покажем скелетоны карточек */}
            {loadingList && (
                <div className="gallery-grid">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="gallery-card">
                            <div className="skeleton skeleton-image" />
                        </div>
                    ))}
                </div>
            )}

            {!loadingList && (
                <div className="gallery-grid">
                    {list.map((anime) => (
                        <div key={anime.mal_id} className="gallery-card">
                            <LazyImage
                                src={anime.images?.jpg?.image_url}
                                alt={anime.title}
                            />
                            <div className="gallery-card-title">
                                {anime.title}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loadingList && list.length === 0 && (
                <p>No anime loaded. Try searching on the main page.</p>
            )}
        </div> 
    );
}
