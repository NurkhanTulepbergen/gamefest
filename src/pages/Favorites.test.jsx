import { render, screen } from "@testing-library/react";
import AnimeListPage from "./AnimeListPage";

jest.mock("react-router-dom", () => ({
    useSearchParams: () => [
        new URLSearchParams({ q: "", page: "1", limit: "10" }),
        jest.fn(),
    ],
}));

jest.mock("react-redux", () => ({
    useDispatch: () => jest.fn(),
    useSelector: () => ({
        list: [
            { id: 1, title: "Naruto" },
            { id: 2, title: "Bleach" },
        ],
        loadingList: false,
        errorList: null,
        pagination: { last_visible_page: 5 },
    }),
}));

jest.mock("../features/items/itemsSlice", () => ({
    fetchItems: jest.fn(),
}));

jest.mock("../hooks/useDebounce", () => ({
    useDebounce: (value) => value,
}));

jest.mock("../components/AnimeList", () => () => (
    <div>Mocked AnimeList</div>
));

test("AnimeListPage renders without crashing", () => {
    render(<AnimeListPage />);

    expect(screen.getByText("Mocked AnimeList")).toBeInTheDocument();
});
