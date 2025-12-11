export interface AnimeImage {
    image_url: string;
}

export interface Anime {
    mal_id: number;
    title: string;
    images: {
        jpg: AnimeImage;
        webp?: AnimeImage;
    };
    synopsis?: string;
    score?: number;
    status?: string;
}

export interface Pagination {
    last_visible_page: number;
    has_next_page: boolean;
}

export interface AnimeListResponse {
    items: Anime[];
    pagination: Pagination;
}
