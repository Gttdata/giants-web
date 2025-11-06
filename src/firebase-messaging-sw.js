// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/9.17.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.17.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyDPsAs7ZyNb_YBWpKC-IiVTp2twOsyLrU0",
  authDomain: "giants-foundation.firebaseapp.com",
  projectId: "giants-foundation",
  storageBucket: "giants-foundation.appspot.com",
  messagingSenderId: "394630238705",
  appId: "1:394630238705:web:43f0dabef4d9bda86bf450",
  measurementId: "G-6JG0ZKWJLM"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();