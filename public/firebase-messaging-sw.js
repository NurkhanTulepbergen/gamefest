/* eslint-disable no-undef */

importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCqE5AUtCXGZPp4kvDYNlchI4Vw-zJMp30",
    authDomain: "jojo-d6db1-c1dc7.firebaseapp.com",
    projectId: "jojo-d6db1-c1dc7",
    storageBucket: "jojo-d6db1-c1dc7.firebasestorage.app",
    messagingSenderId: "460646339414",
    appId: "1:460646339414:web:4e542ceec8999d85443cf7",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("[SW] Background message:", payload);

    const title = payload.notification.title;
    const options = {
        body: payload.notification.body,
        icon: "/logo192.png",
    };

    self.registration.showNotification(title, options);
});
