const firebase = require("firebase/app");
require("firebase/firestore");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaq-iUYDtuNEK2BWRqUY76L1TwM2UChhc",
  authDomain: "mynewwev.firebaseapp.com",
  databaseURL: "https://mynewwev-default-rtdb.firebaseio.com",
  projectId: "mynewwev",
  storageBucket: "mynewwev.appspot.com",
  messagingSenderId: "934575554033",
  appId: "1:934575554033:web:6d399ef996f13418d71850",
  measurementId: "G-32CXSB0RG8"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();