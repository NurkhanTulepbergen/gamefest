// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../features/auth/authSlice";

import "./Login.css";

export default function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { error } = useSelector((state) => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [localError, setLocalError] = useState("");

    function validateEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    function validatePassword(pass) {
        return (
            pass.length >= 8 &&
            /[0-9]/.test(pass) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(pass)
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError("");

        // === Email validation ===
        if (!validateEmail(email)) {
            return setLocalError("Invalid email format");
        }

        // === Password validation ===
        if (!validatePassword(password)) {
            return setLocalError(
                "Password must be 8+ chars, include one number and one special character"
            );
        }

        // === Password match ===
        if (password !== repeatPassword) {
            return setLocalError("Passwords do not match");
        }

        // === Dispatch signup ===
        const result = await dispatch(signupUser({ email, password }));

        if (result.meta.requestStatus === "fulfilled") {
            navigate("/profile");
        }
    };

    return (
        <div className="auth-page">
            <h2>Create Account</h2>

            {/* Validation errors */}
            {localError && <p style={{ color: "red" }}>{localError}</p>}

            {/* Redux errors from Firebase */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password (8+ chars, number, special)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Repeat password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                />

                <button>Create Account</button>
            </form>

            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}
