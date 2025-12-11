// src/services/profileService.js

import { auth } from "../firebase";

/**
 * @typedef {Object} UserProfile
 * @property {string} uid
 * @property {string | null} email
 * @property {string} createdAt
 * @property {string} lastLogin
 */

/**
 * Service for working with current user profile.
 * Only reads data, does NOT update Firebase Auth profile.
 */
export const profileService = {
    /**
     * Получить профиль текущего пользователя Firebase Auth.
     * @returns {Promise<UserProfile>}
     */
    async getCurrentProfile() {
        const user = auth.currentUser;

        if (!user) {
            throw new Error("User is not authenticated");
        }

        return {
            uid: user.uid,
            email: user.email,
            createdAt: user.metadata.creationTime,
            lastLogin: user.metadata.lastSignInTime,
        };
    },

    /**
     * Обновление профиля недоступно без backend.
     * Метод-«заглушка» для проекта TSIS.
     */
    async updateProfile() {
        console.warn("Profile updates require a backend server.");
        return {
            success: false,
            message: "Profile update is not implemented",
        };
    },
};
