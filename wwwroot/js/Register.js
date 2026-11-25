import { auth, createUserWithEmailAndPassword} from "./firebase.js";

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (e) { e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const messageDiv = document.getElementById("message");

  if (password !== confirmPassword) {
    messageDiv.textContent = "Passwords do not match.";
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    messageDiv.textContent = "Account created successfully!";
    window.location.href = "/Home/Index"; 
  } catch (error) {
    messageDiv.textContent = `Error: ${error.message}`;
  }
});