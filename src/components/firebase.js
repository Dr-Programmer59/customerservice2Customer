// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyoJrgiJzPehdcVPq4L6Smr_ulNjG0IK4",
  authDomain: "customer-service-6f1c0.firebaseapp.com",
  projectId: "customer-service-6f1c0",
  storageBucket: "customer-service-6f1c0.appspot.com",
  messagingSenderId: "54365695699",
  appId: "1:54365695699:web:899d21fca2f4b9b79b6e26",
  measurementId: "G-FFY89T2GPZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage };
