import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { auth, db, createUserWithEmailAndPassword, updateProfile } from "./firebase.js";

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const messageDiv = document.getElementById("message");

  if (password !== confirmPassword) {
    messageDiv.textContent = "Passwords do not match.";
    return;
  }

  try {
    // 1) Create the account (teacher's code)
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // 2) Save the name in the account (so "Welcome, name" works)
    await updateProfile(user, { displayName: name });

    // 3) Save the user in the database: users/{uid}
    await set(ref(db, `users/${user.uid}`), {
      name: name,
      email: email,
      role: "customer"
    });

    messageDiv.textContent = "Account created successfully!";
    window.location.href = "/Home/Index";
  } catch (error) {
    messageDiv.textContent = `Error: ${error.message}`;
  }
});