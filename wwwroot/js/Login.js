import {auth, signInWithEmailAndPassword} from "./firebase.js";

const adminUIDs = ['wIj8z1GIXLWucY6rPIXcpBFk6Dz2', 'hLcpaNrsnQhB3dtrLm4gnMXDBVE2'];

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const messageDiv = document.getElementById("message");

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    messageDiv.textContent = "Login successful!";

    if (adminUIDs.includes(result.user.uid)) {
      window.location.href = "/Admin/Index"; 
    } else {
      window.location.href = "/Home/Index"; 
    }
  } catch (error) {
    messageDiv.textContent = `Error: ${error.message}`;
  }
});