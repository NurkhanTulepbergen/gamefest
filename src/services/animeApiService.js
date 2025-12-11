// src/services/animeApiService.js

/**
 * ============================
 * TYPESCRIPT TYPE IMPORTS
 * ============================
 * @typedef {import("../types/anime").Anime} Anime
 * @typedef {import("../types/anime").Pagination} Pagination
 * @typedef {import("../types/anime").AnimeListResponse} AnimeListResponse
 */

const BASE_URL = "https://api.jikan.moe/v4";

/**
 * Fetch list of anime with query, pagination, and AbortSignal.
 *
 * @param {Object} params
 * @param {string} [params.query=""]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=10]
 * @param {AbortSignal} [params.signal]
 *
 * @returns {Promise<AnimeListResponse>}
 */
export async function getAll({ query = "", page = 1, limit = 10, signal } = {}) {
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    params.set("page", String(page));
    params.set("limit", String(limit));

    const url = `${BASE_URL}/anime?${params.toString()}`;

    const response = await fetch(url, { signal });

    if (!response.ok) {
        throw new Error(`Failed to fetch anime list: ${response.status}`);
    }

    const json = await response.json();

    return {
        items: json.data || [],
        pagination: json.pagination || null,
    };
}

/**
 * Fetch one anime by ID.
 *
 * @param {number|string} id
 * @param {Object} opts
 * @param {AbortSignal} [opts.signal]
 *
 * @returns {Promise<Anime>}
 */
export async function getAnimeById(id, { signal } = {}) {
    const url = `${BASE_URL}/anime/${id}`;

    const response = await fetch(url, { signal });
    if (!response.ok) {
        throw new Error(`Failed to fetch anime #${id}: ${response.status}`);
    }

    const json = await response.json();
    return json.data;
}
