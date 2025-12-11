// src/components/Navbar.jsx
import { NavLink, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { useTranslation } from "react-i18next";

import "./Navbar.css";

export default function Navbar() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const { t, i18n } = useTranslation();

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const changeLang = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <nav className="navbar">
            {/* LEFT SIDE — LOGO */}
            <div className="navbar-left">
                <Link to="/items" className="logo">
                    🎌 <span>Anime Finder</span>
                </Link>
            </div>

            {/* RIGHT SIDE — LINKS */}
            <div className="navbar-links">
                {/* HOME */}
                <NavLink
                    to={user ? "/home" : "/login"}
                    className={({ isActive }) =>
                        isActive && user ? "active" : ""
                    }
                >
                    {t("home")}
                </NavLink>

                {/* PUBLIC */}
                <NavLink to="/items">{t("all_anime")}</NavLink>
                <NavLink to="/favorites">{t("favorites")}</NavLink>

                {/* PRIVATE */}
                {user && (
                    <>
                        <NavLink to="/profile">{t("profile")}</NavLink>

                        <button className="navlink-button" onClick={handleLogout}>
                            {t("logout")}
                        </button>
                    </>
                )}

                {/* AUTH (if not logged in) */}
                {!user && (
                    <>
                        <NavLink to="/login">{t("login")}</NavLink>
                        <NavLink to="/register">{t("signup")}</NavLink>
                    </>
                )}

                {/* LANGUAGE SWITCHER */}
                <div className="lang-switch">
                    <button onClick={() => changeLang("en")}>EN</button>
                    <button onClick={() => changeLang("ru")}>RU</button>
                    <button onClick={() => changeLang("kz")}>KZ</button>
                </div>
            </div>
        </nav>
    );
}
