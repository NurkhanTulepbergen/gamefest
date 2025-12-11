import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import SearchBar from "../components/SearchBar";
import AnimeList from "../components/AnimeList";
import { fetchItems } from "../features/items/itemsSlice";
import { useDebounce } from "../hooks/useDebounce";

import "../components/AnimeList.css";

export default function AnimeListPage() {
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();

    // -------------------------------
    // URL STATE
    // -------------------------------
    const queryFromUrl = params.get("q") || "";
    const pageFromUrl = Number(params.get("page") || 1);
    const limitFromUrl = Number(params.get("limit") || 10);

    // -------------------------------
    // LOCAL SEARCH INPUT STATE
    // -------------------------------
    const [searchTerm, setSearchTerm] = useState(queryFromUrl);

    // Debounced search — custom hook #1
    const debouncedSearch = useDebounce(searchTerm, 500);

    const { list, loadingList, errorList, pagination } =
        useSelector((state) => state.items);

    // 🔄 Sync input with URL when URL changes manually
    useEffect(() => {
        setSearchTerm(queryFromUrl);
    }, [queryFromUrl]);

    // ----------------------------------
    // UPDATE URL when debounced value changes
    // ----------------------------------
    useEffect(() => {
        if (debouncedSearch === queryFromUrl) return;

        const next = {};

        if (debouncedSearch.trim()) next.q = debouncedSearch;

        next.page = 1;
        next.limit = limitFromUrl;

        setParams(next);
    }, [debouncedSearch, queryFromUrl, limitFromUrl, setParams]);

    // ----------------------------------
    // FETCH DATA when URL changes
    // ----------------------------------
    useEffect(() => {
        dispatch(
            fetchItems({
                query: queryFromUrl,
                page: pageFromUrl,
                limit: limitFromUrl,
            })
        );
    }, [dispatch, queryFromUrl, pageFromUrl, limitFromUrl]);

    // ----------------------------------
    // CLEAR SEARCH
    // ----------------------------------
    const handleClear = useCallback(() => {
        setSearchTerm("");

        const next = new URLSearchParams(params);
        next.delete("q");
        next.set("page", 1);
        next.set("limit", limitFromUrl);

        setParams(next);
    }, [params, limitFromUrl, setParams]);

    // ----------------------------------
    // PAGINATION
    // ----------------------------------
    const totalPages = useMemo(
        () => pagination?.last_visible_page || 1,
        [pagination]
    );

    const goToPage = useCallback(
        (newPage) => {
            const next = {};

            if (queryFromUrl) next.q = queryFromUrl;
            next.page = newPage;
            next.limit = limitFromUrl;

            setParams(next);
        },
        [queryFromUrl, limitFromUrl, setParams]
    );

    const handleLimitChange = useCallback(
        (e) => {
            const newLimit = Number(e.target.value) || 10;

            const next = {};
            if (queryFromUrl) next.q = queryFromUrl;

            next.page = 1;
            next.limit = newLimit;

            setParams(next);
        },
        [queryFromUrl, setParams]
    );

    // ----------------------------------
    // RENDER
    // ----------------------------------
    return (
        <div className="app">
            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onClear={handleClear}
            />

            {/* PAGINATION */}
            <div className="pagination-controls">
                <div className="pagination-left">
                    <button
                        disabled={pageFromUrl <= 1}
                        onClick={() => goToPage(pageFromUrl - 1)}
                    >
                        Prev
                    </button>

                    <span>
                        Page {pageFromUrl} / {totalPages}
                    </span>

                    <button
                        disabled={pageFromUrl >= totalPages}
                        onClick={() => goToPage(pageFromUrl + 1)}
                    >
                        Next
                    </button>
                </div>

                <div className="pagination-right">
                    <label>
                        Items per page:{" "}
                        <select value={limitFromUrl} onChange={handleLimitChange}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </label>
                </div>
            </div>

            {loadingList && <p>Loading...</p>}
            {errorList && <p className="error">{errorList}</p>}

            {!loadingList && !errorList && <AnimeList animeList={list} />}
        </div>
    );
}
