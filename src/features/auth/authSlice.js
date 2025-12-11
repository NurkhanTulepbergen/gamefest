import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

function serializeUser(user) {
    if (!user) return null;

    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
    };
}

export const initAuth = createAsyncThunk("auth/init", async () => {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            resolve(serializeUser(user));
        });
    });
});

export const loginUser = createAsyncThunk(
    "auth/login",
    async ({ email, password }, thunkAPI) => {
        try {
            const result = await authService.login(email, password);
            return serializeUser(result.user); // << FIXED
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const signupUser = createAsyncThunk(
    "auth/signup",
    async ({ email, password }, thunkAPI) => {
        try {
            const result = await authService.signup(email, password);
            return serializeUser(result.user); // << FIXED
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
    await authService.logout();
    return true;
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: true,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(initAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(initAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // already serializable
            })

            .addCase(loginUser.pending, (state) => {
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload; // already serializable
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(signupUser.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                localStorage.removeItem("favorites");
            });
    },
});

export default authSlice.reducer;
