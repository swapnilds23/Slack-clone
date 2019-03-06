import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var config = {
    apiKey: "AIzaSyDRJnFfavbiF_JGH_BlXVanAuUyTdmQQxw",
    authDomain: "react-slack-clone-e694f.firebaseapp.com",
    databaseURL: "https://react-slack-clone-e694f.firebaseio.com",
    projectId: "react-slack-clone-e694f",
    storageBucket: "react-slack-clone-e694f.appspot.com",
    messagingSenderId: "471628348349"
  };

firebase.initializeApp(config);

export default firebase;
