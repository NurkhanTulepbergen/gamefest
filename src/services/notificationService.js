import { messaging, db } from "../firebase";
import { getToken, onMessage } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";

const VAPID_KEY =
    "BIhc5KV8Q9fd9cj2elneE-SH7z4TW7Ve_IbFLlDzYWLm2A_h7DWz0vLKDxNPGrDBTu1qei8ORnxHRWWKlVew-_k";


export async function requestNotificationPermission(uid) {
    try {
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
            console.log("Notifications blocked by user");
            return null;
        }

        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
        });

        if (!token) {
            console.log("No FCM token received");
            return null;
        }

        console.log("FCM Token:", token);

        await setDoc(
            doc(db, "userTokens", uid),
            { token, updatedAt: Date.now() },
            { merge: true }
        );

        return token;
    } catch (err) {
        console.error("Error getting notification permission:", err);
        return null;
    }
}

export function onForegroundNotification(callback) {
    return onMessage(messaging, callback);
}
