import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAll, getAnimeById } from "../../services/animeApiService";

// ===============================
// ⭐ FETCH LIST with query + page + limit + abort signal
// ===============================
export const fetchItems = createAsyncThunk(
    "items/fetchItems",
    async ({ query = "", page = 1, limit = 10 }, thunkAPI) => {
        try {
            const { signal } = thunkAPI;
            const response = await getAll({ query, page, limit, signal });

            return {
                items: response.items,
                pagination: response.pagination,
                query,
                page,
                limit,
            };
        } catch (e) {
            if (e.name === "AbortError") return;
            return thunkAPI.rejectWithValue("Error loading anime list");
        }
    }
);

// ===============================
// ⭐ FETCH ONE ANIME
// ===============================
export const fetchItemById = createAsyncThunk(
    "items/fetchItemById",
    async (id, thunkAPI) => {
        try {
            const { signal } = thunkAPI;
            return await getAnimeById(id, { signal });
        } catch (e) {
            if (e.name === "AbortError") return;
            return thunkAPI.rejectWithValue("Error loading anime details");
        }
    }
);

// ===============================
// ⭐ FAVORITES — LOCAL STORAGE
// ===============================
const LOCAL_KEY = "favorites";

function loadLocalFavorites() {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
    } catch {
        return [];
    }
}

function saveLocalFavorites(favs) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(favs));
}

const initialState = {
    list: [],
    selectedItem: null,

    loadingList: false,
    loadingItem: false,

    errorList: null,
    errorItem: null,

    query: "",
    page: 1,
    limit: 10,
    pagination: null,

    // ⭐ локальные избранные (до логина)
    favorites: loadLocalFavorites(),

    // ⭐ флаг UI-сообщения о merge
    mergeMessage: false,
};

const itemsSlice = createSlice({
    name: "items",
    initialState,

    reducers: {
        // -------------------------------
        // SEARCH QUERY
        // -------------------------------
        setQuery(state, action) {
            state.query = action.payload;
        },

        // -------------------------------
        // ⭐ toggle FAVORITES LOCALLY
        // -------------------------------
        toggleFavoriteLocal(state, action) {
            const anime = action.payload;
            const exists = state.favorites.some((f) => f.mal_id === anime.mal_id);

            state.favorites = exists
                ? state.favorites.filter((f) => f.mal_id !== anime.mal_id)
                : [...state.favorites, anime];

            saveLocalFavorites(state.favorites);
        },

        // -------------------------------
        // ⭐ Replace favorites (after merge or Firestore load)
        // -------------------------------
        setFavorites(state, action) {
            state.favorites = action.payload;
            saveLocalFavorites(state.favorites);
        },

        // -------------------------------
        // ⭐ Merge notification flag
        // -------------------------------
        showMergeMessage(state) {
            state.mergeMessage = true;
        },
        hideMergeMessage(state) {
            state.mergeMessage = false;
        },
    },

    extraReducers: (builder) => {
        builder
            // ===============================
            // LIST
            // ===============================
            .addCase(fetchItems.pending, (state) => {
                state.loadingList = true;
                state.errorList = null;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                if (!action.payload) return;
                state.loadingList = false;

                const { items, pagination, query, page, limit } =
                    action.payload;

                state.list = items;
                state.pagination = pagination;
                state.query = query;
                state.page = page;
                state.limit = limit;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.loadingList = false;
                state.errorList = action.payload || "Failed to load anime";
            })

            // ===============================
            // DETAILS
            // ===============================
            .addCase(fetchItemById.pending, (state) => {
                state.loadingItem = true;
                state.errorItem = null;
            })
            .addCase(fetchItemById.fulfilled, (state, action) => {
                if (!action.payload) return;
                state.loadingItem = false;
                state.selectedItem = action.payload;
            })
            .addCase(fetchItemById.rejected, (state, action) => {
                state.loadingItem = false;
                state.errorItem = action.payload;
            });
    },
});

export const {
    setQuery,
    toggleFavoriteLocal,
    setFavorites,
    showMergeMessage,
    hideMergeMessage,
} = itemsSlice.actions;

export default itemsSlice.reducer;
