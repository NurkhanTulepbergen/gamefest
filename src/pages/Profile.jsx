// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { profileService } from "../services/profileService";
import "./Profile.css";

export default function Profile() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        let cancelled = false;

        async function loadProfile() {
            try {
                const data = await profileService.getCurrentProfile();
                if (!cancelled) setProfile(data);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadProfile();
        return () => {
            cancelled = true;
        };
    }, [user]);

    if (!user) return <h2>Please login</h2>;
    if (loading) return <h2>Loading profile...</h2>;

    const letter = profile?.email?.charAt(0).toUpperCase() || "?";

    return (
        <div className="profile-page">
            <div className="profile-card">
                <h2>Your Profile</h2>

                <div className="profile-avatar">
                    {letter}
                </div>

                <div className="profile-info">
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>UID:</strong> {profile.uid}</p>
                    <p><strong>Created:</strong> {profile.createdAt}</p>
                    <p><strong>Last login:</strong> {profile.lastLogin}</p>
                </div>

                <button onClick={() => dispatch(logoutUser())}>
                    Logout
                </button>
            </div>
        </div>
    );
}
