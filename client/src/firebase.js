import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCwy_tj4a4f5L6JkHWZOwktM81GK6R-a0Y",
  authDomain: "video-b8ba8.firebaseapp.com",
  projectId: "video-b8ba8",
  storageBucket: "video-b8ba8.appspot.com",
  messagingSenderId: "320393588669",
  appId: "1:320393588669:web:33e158111d7207b9beacd4"
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const storage = firebase.storage();
export default app;
