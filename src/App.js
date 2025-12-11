import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Suspense, lazy, useEffect } from "react";
import "./i18n";

import { initAuth } from "./features/auth/authSlice";

const RootLayout = lazy(() => import("./layouts/RootLayout"));
const Home = lazy(() => import("./pages/Home"));
const AnimeListPage = lazy(() => import("./pages/AnimeListPage"));
const AnimeDetails = lazy(() => import("./pages/AnimeDetails"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Profile = lazy(() => import("./pages/Profile"));
const Gallery = lazy(() => import("./pages/GalleryPage"));

function Protected({ children }) {
    const user = useSelector((state) => state.auth.user);
    return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.auth.loading);

    useEffect(() => {
        dispatch(initAuth());
    }, [dispatch]);

    if (loading) return <h2>Loading auth...</h2>;

    return (
        <BrowserRouter>
            {/* Suspense fallback — applies to all lazy pages */}
            <Suspense fallback={<h2 style={{ textAlign: "center" }}>Loading...</h2>}>

                <Routes>
                    {/* Redirect root → items */}
                    <Route path="/" element={<Navigate to="/items" replace />} />

                    {/* ---------- PUBLIC ROUTES ---------- */}
                    <Route element={<RootLayout />}>
                        <Route path="items" element={<AnimeListPage />} />
                        <Route path="items/:id" element={<AnimeDetails />} />
                        <Route path="gallery" element={<Gallery />} />

                        {/* Favorites is public */}
                        <Route path="favorites" element={<Favorites />} />

                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Signup />} />
                    </Route>

                    {/* ---------- PRIVATE ROUTES ---------- */}
                    <Route
                        element={
                            <Protected>
                                <RootLayout />
                            </Protected>
                        }
                    >
                        <Route path="profile" element={<Profile />} />
                        <Route path="home" element={<Home />} />
                    </Route>

                    {/* Catch all → items */}
                    <Route path="*" element={<Navigate to="/items" replace />} />
                </Routes>

            </Suspense>
        </BrowserRouter>
    );
}
