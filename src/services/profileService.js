import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const profileService = {
    async getCurrentProfile() {
        const user = auth.currentUser;
        if (!user) return null;

        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            const data = {
                uid: user.uid,
                email: user.email,
                createdAt: new Date().toISOString(),
                photoBase64: null,
            };
            await setDoc(ref, data);
            return data;
        }

        return snap.data();
    },

    async uploadAvatar(base64Image) {
        const user = auth.currentUser;
        if (!user) throw new Error("Not authenticated");

        await updateDoc(doc(db, "users", user.uid), {
            photoBase64: base64Image,
        });

        return base64Image;
    },
};
