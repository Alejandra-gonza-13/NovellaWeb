import { auth, onAuthStateChanged, updateProfile } from "./firebase.js";

onAuthStateChanged(auth, function(user) {
    if(user) {
        document.getElementById('name').value = user.displayName || "";
    } else {
        window.location.href = '/Account/Login';
    }
});

const editForm = document.getElementById("editForm");

editForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const messageDiv = document.getElementById("message");

    try {
        await updateProfile(auth.currentUser, { displayName: name });
        messageDiv.textContent = "Profile updated";
        window.location.href = "/Account/Profile";
    } catch (error) {
        messageDiv.textContent = `Error: ${error.message}`;
    }
});

