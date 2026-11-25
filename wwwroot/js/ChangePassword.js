import { auth, onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "./firebase.js";

onAuthStateChanged(auth, function(user) {
    if(!user) {
        window.location.href = '/Account/Login';
    }
});

const passwordForm = document.getElementById("passwordForm");

passwordForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const messageDiv = document.getElementById("message");

    if (newPassword !== confirmPassword) {
        messageDiv.textContent = "New passwords do not match.";
        return;
    }

    try {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        messageDiv.textContent = "Password changed successfully!";
    } catch (error) {
        messageDiv.textContent = error.message;
    }
});
