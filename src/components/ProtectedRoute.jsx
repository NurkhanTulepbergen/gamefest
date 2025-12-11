import { Navigate } from "react-router-dom";
import { useAuth } from "../services/authService";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return null; // пока грузится — ничего не показываем

    return user ? children : <Navigate to="/login" replace />;
}
