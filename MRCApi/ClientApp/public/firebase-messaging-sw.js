importScripts("https://www.gstatic.com/firebasejs/7.19.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.19.0/firebase-messaging.js");
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
if(firebase.messaging.isSupported()){
     firebase.initializeApp(firebaseConfig);
     const messaging = firebase.messaging();
     messaging.setBackgroundMessageHandler(function(payload) {
          console.log('[firebase-messaging-sw.js] Received background message ', payload);
          const notificationTitle = 'Background Message Title';
          const notificationOptions = {
               body: 'Background Message body.',
               icon: '/logo.png'
          };
          return self.registration.showNotification(notificationTitle,notificationOptions);
     });
     self.addEventListener("notificationclick", function(event) {
          console.log(event);
     });
}