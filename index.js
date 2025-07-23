// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBI9K0ia9uU7jBE8LXDomlIrsoYjNT8UDI",
  authDomain: "habittracker-51406.firebaseapp.com",
  databaseURL: "https://habittracker-51406-default-rtdb.firebaseio.com",
  projectId: "habittracker-51406",
  storageBucket: "habittracker-51406.firebasestorage.app",
  messagingSenderId: "977960568554",
  appId: "1:977960568554:web:df9488ca3186f4d088b993"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Reference to the habits node
const habitsRef = ref(database, 'habits');

// Real-time listener
onValue(habitsRef, (snapshot) => {
  const data = snapshot.val();
  const output = document.getElementById("output");

  if (data) {
    output.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } else {
    output.innerText = "No habit data found.";
  }
});
