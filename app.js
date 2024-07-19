const addBtn = document.querySelector("#addBtn");
const main = document.querySelector("#main");

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const loginError = document.getElementById("login-error");
const signupSuccess = document.getElementById("signup-success");
const signupError = document.getElementById("signup-error");

// Function to handle user login
const loginUser = async (username, password) => {
  try {
    // Simulate API call to validate credentials
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      // Store user session/token in localStorage or cookies
      localStorage.setItem("token", data.token);
      // Redirect or perform necessary actions after successful login
      window.location.href = "/dashboard";
    } else {
      loginError.style.display = "block";
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
};

// Function to handle user signup
const signupUser = async (username, password) => {
  try {
    // Simulate API call to create new user
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      signupSuccess.style.display = "block";
      signupError.style.display = "none";
    } else {
      signupError.style.display = "block";
      signupSuccess.style.display = "none";
    }
  } catch (error) {
    console.error("Error signing up:", error);
  }
};

// Event listeners for login and signup buttons
document.getElementById("login-btn").addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  loginUser(username, password);
});

document.getElementById("signup-btn").addEventListener("click", () => {
  const username = document.getElementById("new-username").value;
  const password = document.getElementById("new-password").value;
  signupUser(username, password);
});
addBtn.addEventListener("click", function () {
  addNote();
});

// script.js

// Function to filter notes based on search query
const filterNotes = (query) => {
  const notes = document.querySelectorAll(".note");
  notes.forEach((note) => {
    const text = note.querySelector("textarea").value.toLowerCase();
    if (text.includes(query.toLowerCase())) {
      note.style.display = ""; // Show note if it matches the query
    } else {
      note.style.display = "none"; // Hide note if it doesn't match
    }
  });
};

// Event listener for search input
const searchInput = document.querySelector("#search-input");
searchInput.addEventListener("input", function () {
  const query = this.value.trim(); // Get search query and trim whitespace
  filterNotes(query); // Filter notes based on the query
});

// Your existing code for adding notes and other functionalities
// Make sure to include the addNote function and other relevant code here

const saveNotes = () => {
  const notes = document.querySelectorAll(".note");
  const data = [];

  notes.forEach((note) => {
    const text = note.querySelector("textarea").value;
    const completed = note.querySelector(".complete-checkbox").checked;
    const important = note.querySelector(".important-checkbox").checked;
    const timestamp = new Date().getTime();

    data.push({
      text,
      completed,
      important,
      timestamp,
    });
  });

  if (data.length === 0) {
    localStorage.removeItem("notes");
  } else {
    localStorage.setItem("notes", JSON.stringify(data));
  }
};

//  <div class="note">
// <div class="tool">
//     <i class="fas fa-save"></i>
//     <i class="fas fa-trash"></i>
// </div>
// <textarea></textarea>
// </div>

const addNote = (
  text = "",
  completed = false,
  important = false,
  timestamp = null,
  reminder = null
) => {
  const note = document.createElement("div");
  note.classList.add("note");
  const updateTimestamp = () => {
    const currentTime = new Date().getTime();
    const timestampElement = note.querySelector(".timestamp");
    timestampElement.textContent = new Date(currentTime).toLocaleString();
  };

  const currentTime = new Date().getTime();
  note.innerHTML = `
    <div class="tool">
         <i class="save fas fa-save"></i>
         <i class="trash fas fa-trash"></i> 
    </div>
    <textarea>${text}</textarea>
    <input class="complete-checkbox" type="checkbox" ${
      completed ? "checked" : ""
    }>
    <label>Completed</label>
    
    <input class="important-checkbox" type="checkbox" ${
      important ? "checked" : ""
    }>
    <label>Important</label>
    <div class="timestamp">${
      timestamp
        ? new Date(timestamp).toLocaleString()
        : new Date(currentTime).toLocaleString()
    }</div>
    <input class="reminder-input" type="datetime-local" value="${
      reminder || ""
    }">
    <label>Set Reminder</label>
    
    `;
  const textarea = note.querySelector("textarea");
  textarea.addEventListener("input", function () {
    updateTimestamp();
  });

  textarea.addEventListener("input", function () {
    saveNotes(); // Call saveNotes whenever text is inputted into the textarea
  });

  note.querySelector(".trash").addEventListener("click", function () {
    note.remove();
    saveNotes();
  });
  note.querySelector(".save").addEventListener("click", function () {
    saveNotes();
  });
  note.querySelector("textarea").addEventListener("focusout", function () {
    saveNotes();
  });
  note
    .querySelector(".complete-checkbox")
    .addEventListener("change", function () {
      saveNotes();
    });
  note
    .querySelector(".important-checkbox")
    .addEventListener("change", function () {
      saveNotes();
    });
  main.appendChild(note);
  saveNotes();
};

(function () {
  const lsNotes = JSON.parse(localStorage.getItem("notes"));
  if (lsNotes === null) {
    addNote();
  } else {
    lsNotes.forEach((lsNote) => {
      addNote(
        lsNote.text,
        lsNote.completed,
        lsNote.important,
        lsNote.timestamp
      );
    });
  }
})();
