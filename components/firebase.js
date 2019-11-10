import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDorF4oFKCM5bsf96QrVfMa2tUyN7BuZeM",
  authDomain: "foodsbag.firebaseapp.com",
  databaseURL: "https://foodsbag.firebaseio.com",
  projectId: "foodsbag",
  storageBucket: "foodsbag.appspot.com",
  messagingSenderId: "352088861740",
  appId: "1:352088861740:web:33b743b64bc70363513589",
  measurementId: "G-0WWMPSRFGS"
};
  
  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  
  firebase.auth().signInWithEmailAndPassword("foodbag01@gmail.com", "potaraya12").catch(function(error) {
    console.log("signin error",error);
  });

  export default firebase;