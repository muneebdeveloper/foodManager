import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA2RxgI-b_nHm_zYk-qT2dVskQ0K80L634",
  authDomain: "foodmanager-4c320.firebaseapp.com",
  databaseURL: "https://foodmanager-4c320.firebaseio.com",
  projectId: "foodmanager-4c320",
  storageBucket: "foodmanager-4c320.appspot.com",
  messagingSenderId: "958673678314",
  appId: "1:958673678314:web:6444bb68363f93dea5cc93",
  measurementId: "G-314830G8MN"
};
  
  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  
  firebase.auth().signInWithEmailAndPassword("muneebakhlaqnt@gmail.com", "As12345").catch(function(error) {
    console.log("signin error",error);
  });

  export default firebase;