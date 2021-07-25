import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA5iyCovr2B_uAxiaUpa7MSPhv2AYH2Euo",
  authDomain: "nexthing-8109c.firebaseapp.com",
  projectId: "nexthing-8109c",
  storageBucket: "nexthing-8109c.appspot.com",
  messagingSenderId: "99096384049",
  appId: "1:99096384049:web:30bcbc4516ca3711317b10",
}

if (!firebase.app.length) {
    firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();