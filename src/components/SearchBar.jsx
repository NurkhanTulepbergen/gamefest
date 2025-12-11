import "./SearchBar.css";

export default function SearchBar({ searchTerm, setSearchTerm, onClear }) {
    return (
        <form onSubmit={(e) => e.preventDefault()} className="search-bar">
            <div className="search-wrapper">
                <input
                    type="text"
                    placeholder="Search for anime..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                    name="search"
                />
                {searchTerm && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="clear-button"
                        aria-label="Clear search"
                    >
                        ✖
                    </button>
                )}
                <button type="submit" className="search-button" aria-label="Search">
                    🔍
                </button>
            </div>
        </form>
    );
}
