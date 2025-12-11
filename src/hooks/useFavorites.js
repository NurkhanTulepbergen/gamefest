import { useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";       // ← FIX HERE

import {
    toggleFavoriteLocal,
    setFavorites,
    showMergeMessage,
} from "../features/items/itemsSlice";

import { favoritesService } from "../services/favoritesService";

export function useFavorites() {
    const dispatch = useDispatch();
    const { user } = useAuth();

    const favorites = useSelector((state) => state.items.favorites);

    useEffect(() => {
        if (!user) return;

        (async () => {
            const merged = await favoritesService.restoreUserFavorites(user.uid);

            dispatch(setFavorites(merged));
            dispatch(showMergeMessage());
        })();
    }, [user, dispatch]);

    const isFavorite = useCallback(
        (id) => favorites.some((f) => f.mal_id === id),
        [favorites]
    );

    const toggle = useCallback(
        async (anime) => {
            if (!user) {
                dispatch(toggleFavoriteLocal(anime));
                return;
            }

            dispatch(toggleFavoriteLocal(anime));

            const updated = (() => {
                const exists = favorites.some((f) => f.mal_id === anime.mal_id);

                return exists
                    ? favorites.filter((f) => f.mal_id !== anime.mal_id)
                    : [...favorites, anime];
            })();

            await favoritesService.saveUserFavorites(user.uid, updated);
        },

        [user, favorites, dispatch]
    );

    const count = useMemo(() => favorites.length, [favorites]);

    return {
        favorites,
        toggle,
        isFavorite,
        count,
    };
}
