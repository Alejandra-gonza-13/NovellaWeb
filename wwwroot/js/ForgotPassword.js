import { auth, sendPasswordResetEmail } from "./firebase.js";
const forgotForm = document.getElementById("forgotForm");

forgotForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  
  const email = document.getElementById("email").value;
  const messageDiv = document.getElementById("message");

 try {
    await sendPasswordResetEmail(auth, email);
    messageDiv.textContent = "Reset email sent. Check your inbox.";
  } catch (error) {
    messageDiv.textContent = error.message;
  }
});
