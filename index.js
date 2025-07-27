// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, onValue, remove } from "firebase/database"; // Removed 'push' as it was unused

const firebaseConfig = {
  databaseURL: "https://habittracker-51406-default-rtdb.firebaseio.com",
  projectId: "habittracker-51406",
  storageBucket: "habittracker-51406.firebasestorage.app",
  messagingSenderId: "977960568554",
  appId: "1:977960568554:web:df9488ca3186f4d088b993"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// Reference to the habits node
// const habitsRef = ref(database, 'habits');

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Simple validation (replace with actual authentication logic)
  if (username === "admin" && password === "password123") {
    document.getElementById("habitTracker").style.display = "block"; // Show Habit Tracker
    document.getElementById("loginForm").style.display = "none"; // Hide Login Form
  } else {
    alert("Invalid username or password. Please try again.");
  }
});

// Predefined recommended habits
const recommendedHabits = ["Drink 8 glasses of water", "Exercise for 30 minutes", "Read for 20 minutes", "Practice meditation"];

// Display recommended habits
const recommendedHabitsList = document.getElementById("recommendedHabits");
recommendedHabits.forEach((habit) => {
  const habitItem = document.createElement("li");
  habitItem.textContent = habit;
  habitItem.style.cursor = "pointer";
  habitItem.addEventListener("click", () => {
    const habitExists = habits.some((h) => h.name.toLowerCase() === habit.toLowerCase());
    if (habitExists) {
      alert("This habit is already in your list.");
    } else {
      const timestamp = new Date();
      habits.push({ name: habit, timestamp });
      updateHabitList();
      updateWeeklyProgress();
    }
  });
  recommendedHabitsList.appendChild(habitItem);
});

// Add habit by input
document.getElementById("habitForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const habitInput = document.getElementById("habitInput");
  const habit = habitInput.value.trim();

  if (habit) {
    // Check if the habit already exists (case-insensitive)
    const habitExists = habits.some((h) => h.name.toLowerCase() === habit.toLowerCase());

    if (habitExists) {
      alert("This habit is already in your list.");
    } else {
      const timestamp = new Date();
      habits.push({ name: habit, timestamp }); // Add habit with timestamp
      updateHabitList(); // Update the list to show the new habit
      updateWeeklyProgress(); // Update weekly progress
    }
    habitInput.value = ""; // Clear the input field
  }
});

const habits = []; // Array to store habits with timestamps

document.getElementById("habitForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const habitInput = document.getElementById("habitInput");
  const habit = habitInput.value.trim();

  if (habit) {
    // Check if the habit already exists (case-insensitive)
    const habitExists = habits.some((h) => h.name.toLowerCase() === habit.toLowerCase());

    if (habitExists) {
      alert("This habit is already in your list.");
    } else {
      const timestamp = new Date();
      habits.push({ name: habit, timestamp });
      updateHabitList();
      updateWeeklyProgress();
    }
    habitInput.value = ""; // Clear the input field
  }
});

function updateHabitList() {
  const habitList = document.getElementById("habitList");
  habitList.innerHTML = ""; // Clear the list before updating

  habits.forEach((habit, index) => {
    const habitItem = document.createElement("li");
    habitItem.textContent = `${habit.name} (Added on: ${habit.timestamp.toLocaleDateString()} ${habit.timestamp.toLocaleTimeString()})`;

    // Add a "Remove" button
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.style.marginLeft = "10px";
    removeButton.addEventListener("click", () => {
      habits.splice(index, 1); // Remove the habit from the array
      updateHabitList(); // Update the habit list
      updateWeeklyProgress(); // Update weekly progress
    });

    habitItem.appendChild(removeButton);
    habitList.appendChild(habitItem);
  });
}

function updateWeeklyProgress() {
  const progress = document.getElementById("weeklyProgress");
  progress.innerHTML = "";
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weeklyData = daysOfWeek.map((day) => ({
    day,
    count: habits.filter((habit) => habit.timestamp.getDay() === daysOfWeek.indexOf(day)).length,
  }));

  weeklyData.forEach((data) => {
    const progressItem = document.createElement("div");
    progressItem.textContent = `${data.day}: ${data.count} habits added`;
    progress.appendChild(progressItem);
  });
}

// Real-time listener
onValue(habitsRef, (snapshot) => {
  const data = snapshot.val();
  const output = document.getElementById("output");
  output.innerHTML = "";

  if (data) {
    Object.keys(data).forEach((key) => {
      const habit = data[key];
      const habitDiv = document.createElement("div");
      habitDiv.textContent = habit.name;

      const completeButton = document.createElement("button");
      completeButton.textContent = habit.completed ? "Completed" : "Mark as Complete";
      completeButton.disabled = habit.completed;
      completeButton.addEventListener("click", () => {
        const habitRef = ref(database, `habits/${key}`);
        habitRef.update({ completed: true });
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        const habitRef = ref(database, `habits/${key}`);
        remove(habitRef);
      });

      habitDiv.appendChild(completeButton);
      habitDiv.appendChild(deleteButton);
      output.appendChild(habitDiv);
    });
  } else {
    output.innerText = "No habit data found.";
  }
});