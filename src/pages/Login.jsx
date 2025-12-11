import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";

import "./Login.css";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, error } = useSelector((state) => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await dispatch(loginUser({ email, password }));

        if (result.meta.requestStatus === "fulfilled") {
            navigate("/profile");
        }
    };

    return (
        <div className="auth-page">
            <h2>Login</h2>

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
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button>Login</button>
            </form>

            <p>
                No account? <Link to="/register">Signup</Link>
            </p>
        </div>
    );
}
