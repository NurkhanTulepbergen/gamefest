import { getAll } from "./animeApiService";

global.fetch = jest.fn();

describe("animeApiService", () => {
    test("returns list of anime", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data: [{ mal_id: 1, title: "Naruto" }],
                pagination: { last_visible_page: 1 }
            })
        });

        const res = await getAll({ query: "naruto" });

        expect(res.items[0].title).toBe("Naruto");
    });

    test("throws error on bad response", async () => {
        fetch.mockResolvedValueOnce({ ok: false, status: 500 });

        await expect(getAll()).rejects.toThrow("Failed to fetch");
    });
});
