// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import "./i18n";
import { initAuth } from "./features/auth/authSlice";

import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import AnimeListPage from "./pages/AnimeListPage";
import AnimeDetails from "./pages/AnimeDetails";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

// === Защищённый маршрут (только Redux) ===
function Protected({ children }) {
    const user = useSelector((state) => state.auth.user);
    return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.auth.loading);

    // запускаем слушатель Firebase auth
    useEffect(() => {
        dispatch(initAuth());
    }, [dispatch]);

    if (loading) return <h2>Loading...</h2>;

    return (
        <BrowserRouter>
            <Routes>
                {/* Главная → items */}
                <Route path="/" element={<Navigate to="/items" />} />

                {/* ---------- PUBLIC ROUTES (для всех) ---------- */}
                <Route element={<RootLayout />}>
                    <Route path="items" element={<AnimeListPage />} />
                    <Route path="items/:id" element={<AnimeDetails />} />
                    <Route path="favorites" element={<Favorites />} />  {/* ← ПЕРЕНЕСЛИ СЮДА */}

                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Signup />} />
                </Route>

                {/* ---------- PRIVATE ROUTES (только авторизованные) ---------- */}
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

                {/* Любое неизвестное → items */}
                <Route path="*" element={<Navigate to="/items" />} />
            </Routes>
        </BrowserRouter>

    );
}
