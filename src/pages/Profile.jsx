import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { profileService } from "../services/profileService";

export default function Profile() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const [profile, setProfile] = useState(null);
    const workerRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        workerRef.current = new Worker(
            new URL("../workers/imageWorker.js", import.meta.url)
        );

        profileService.getCurrentProfile().then(setProfile);

        return () => workerRef.current?.terminate();
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        workerRef.current.postMessage(file);

        workerRef.current.onmessage = async (e) => {
            const base64 = e.data;
            await profileService.uploadAvatar(base64);
            setProfile((p) => ({ ...p, photoBase64: base64 }));
        };
    };

    if (!user || !profile) return <h2>Loading...</h2>;

    return (
        <div className="profile-page">
            <div className="profile-card">
                <h2>Your Profile</h2>

                <div className="profile-avatar">
                    {profile.photoBase64 ? (
                        <img src={profile.photoBase64} />
                    ) : (
                        profile.email[0].toUpperCase()
                    )}
                </div>

                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                />

                <p>{profile.email}</p>

                <button onClick={() => dispatch(logoutUser())}>
                    Logout
                </button>
            </div>
        </div>
    );
}
