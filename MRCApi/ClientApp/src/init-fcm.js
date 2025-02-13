import * as firebase from "firebase/app";
import "firebase/messaging";
var firebaseConfig = {
    apiKey: "AIzaSyBFEKTXj2jk-9YpNHgZTmW0h8aBOHNfzs4",
    authDomain: "spiral-affm.firebaseapp.com",
    databaseURL: "https://spiral-affm.firebaseio.com",
    projectId: "spiral-affm",
    storageBucket: "spiral-affm.appspot.com",
    messagingSenderId: "937583395723",
    appId: "1:937583395723:web:688d44057d14caf46f258e",
    measurementId: "G-JJ6P8CFKZ2"
};
let messaging = null;
if (firebase.messaging.isSupported()) {
    const initializedFirebaseApp = firebase.initializeApp(firebaseConfig);
    messaging = initializedFirebaseApp.messaging();
}
export { messaging };