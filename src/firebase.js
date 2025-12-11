import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCqE5AUtCXGZPp4kvDYNlchI4Vw-zJMp30",
    authDomain: "jojo-d6db1-c1dc7.firebaseapp.com",
    projectId: "jojo-d6db1-c1dc7",
    storageBucket: "jojo-d6db1-c1dc7.firebasestorage.app",
    messagingSenderId: "460646339414",
    appId: "1:460646339414:web:4e542ceec8999d85443cf7",
    measurementId: "G-N53SGL6VJ9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export let messaging = null;

if (typeof window !== "undefined" && typeof Notification !== "undefined") {
    isSupported()
        .then(supported => {
            if (supported) messaging = getMessaging(app);
        })
        .catch(() => {
            messaging = null;
        });
}

