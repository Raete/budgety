import firebase from 'firebase'
import firestore from 'firebase/firestore'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAbx9wj35408FCQK3xHAMBeY7r5Xuicej0",
    authDomain: "budgety-3c6fb.firebaseapp.com",
    databaseURL: "https://budgety-3c6fb.firebaseio.com",
    projectId: "budgety-3c6fb",
    storageBucket: "budgety-3c6fb.appspot.com",
    messagingSenderId: "634251350043"
  };
const firebaseApp = firebase.initializeApp(config);
firebaseApp.firestore().settings({ timestampsInSnapshots: true });

export default firebaseApp.firestore()