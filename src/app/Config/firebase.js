
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBmjEVqYjXjd9LfRU-xK1uAxos5MrIUaDQ",
  authDomain: "goo3-c312f.firebaseapp.com",
  projectId: "goo3-c312f",
  storageBucket: "goo3-c312f.appspot.com",
  messagingSenderId: "751556296940",
  appId: "1:751556296940:web:7f3ef7460fd6c838b265c9",
  measurementId: "G-71TJEW00Q6"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);