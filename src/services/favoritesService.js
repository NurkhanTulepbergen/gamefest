import { auth, db } from "../firebase";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc
} from "firebase/firestore";

const LOCAL_KEY = "favorites";

// ---------------------------------------
// LOCAL STORAGE FAVORITES
// ---------------------------------------
function loadLocalFavorites() {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
    } catch {
        return [];
    }
}

function saveLocalFavorites(favs) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(favs));
}

// ---------------------------------------
// FIRESTORE FAVORITES
// ---------------------------------------
async function loadUserFavorites(uid) {
    const ref = doc(db, "favorites", uid);
    const snap = await getDoc(ref);

    return snap.exists() ? snap.data().items || [] : [];
}

async function saveUserFavorites(uid, items) {
    const ref = doc(db, "favorites", uid);
    await setDoc(ref, { items }, { merge: true });
}

// ---------------------------------------
// MERGE LOGIC
// ---------------------------------------
function mergeFavorites(localFavs, serverFavs) {
    const map = new Map();

    [...localFavs, ...serverFavs].forEach(item => {
        map.set(item.mal_id, item);
    });

    return Array.from(map.values());
}

// ---------------------------------------
// PUBLIC API
// ---------------------------------------
export const favoritesService = {
    loadLocalFavorites,
    saveLocalFavorites,

    loadUserFavorites,
    saveUserFavorites,

    mergeFavorites,

    async restoreUserFavorites(uid) {
        const local = loadLocalFavorites();
        const server = await loadUserFavorites(uid);

        const merged = mergeFavorites(local, server);

        await saveUserFavorites(uid, merged);

        localStorage.removeItem(LOCAL_KEY);

        return merged;
    }
};
