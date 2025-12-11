import reducer, { toggleFavoriteLocal, setFavorites } from "./itemsSlice";

describe("itemsSlice", () => {
    test("should toggle favorites", () => {
        const initial = { favorites: [] };

        const anime = { mal_id: 1, title: "Naruto" };

        const state1 = reducer(initial, toggleFavoriteLocal(anime));
        expect(state1.favorites).toHaveLength(1);

        const state2 = reducer(state1, toggleFavoriteLocal(anime));
        expect(state2.favorites).toHaveLength(0);
    });

    test("should replace favorites", () => {
        const state = reducer(
            { favorites: [] },
            setFavorites([{ mal_id: 5 }])
        );

        expect(state.favorites).toEqual([{ mal_id: 5 }]);
    });
});
