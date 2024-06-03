// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth ,GoogleAuthProvider} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAEdgDNCQE60OuPjz8flC_AtV4vs4EYTE",
    authDomain: "dock-mgmt.netlify.app",
  projectId: "dock-mgmt",
  storageBucket: "dock-mgmt.appspot.com",
  messagingSenderId: "1047320063727",
  appId: "1:1047320063727:web:893b25e293a387c22f751a",
  measurementId: "G-E8DGXC6NH8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };