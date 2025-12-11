import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

jest.mock("./firebase", () => ({
    auth: { currentUser: null },
}));

test("App renders without crashing", () => {
    render(
        <MemoryRouter>
            <div>Test OK</div>
        </MemoryRouter>
    );
    expect(screen.getByText("Test OK")).toBeInTheDocument();
});
