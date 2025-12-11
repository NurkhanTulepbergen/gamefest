import React, { Suspense } from "react";
import { render, screen } from "@testing-library/react";

const LazyComp = React.lazy(() => Promise.resolve({ default: () => <div>Loaded</div> }));

test("shows fallback while loading lazy component", async () => {
    render(
        <Suspense fallback={<div>Loading...</div>}>
            <LazyComp />
        </Suspense>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    const loaded = await screen.findByText("Loaded");
    expect(loaded).toBeInTheDocument();
});
