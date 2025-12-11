import { useSelector, useDispatch } from "react-redux";
import { loginUser, signupUser, logoutUser } from "../features/auth/authSlice";

export function useAuth() {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    return {
        user,
        loading,
        error,
        login: (email, password) => dispatch(loginUser({ email, password })),
        signup: (email, password) => dispatch(signupUser({ email, password })),
        logout: () => dispatch(logoutUser())
    };
}
