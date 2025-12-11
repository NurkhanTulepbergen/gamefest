import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

// === LISTEN TO FIREBASE AUTH STATE ===
export const initAuth = createAsyncThunk(
    "auth/init",
    async (_, thunkAPI) => {
        return new Promise((resolve) => {
            onAuthStateChanged(auth, (user) => {
                resolve(user || null);
            });
        });
    }
);

// === LOGIN ===
export const loginUser = createAsyncThunk(
    "auth/login",
    async ({ email, password }, thunkAPI) => {
        try {
            const result = await authService.login(email, password);
            return result.user;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

// === SIGNUP ===
export const signupUser = createAsyncThunk(
    "auth/signup",
    async ({ email, password }, thunkAPI) => {
        try {
            const result = await authService.signup(email, password);
            return result.user;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

// === LOGOUT ===
export const logoutUser = createAsyncThunk(
    "auth/logout",
    async () => {
        await authService.logout();
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: true,
        error: null
    },

    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(initAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(initAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })

            // LOGIN
            .addCase(loginUser.pending, (state) => {
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload;
            })

            // SIGNUP
            .addCase(signupUser.rejected, (state, action) => {
                state.error = action.payload;
            })

            // LOGOUT
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                localStorage.removeItem("favorites"); // ← добавь это!!!
            });
    }
});

export default authSlice.reducer;
