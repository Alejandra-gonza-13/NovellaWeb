import { auth, signOut, onAuthStateChanged } from '/js/firebase.js';

onAuthStateChanged(auth, function(user) {
    if(user) {
        document.getElementById('userName').textContent = user.displayName || "Customer";
        document.getElementById('userEmail').textContent = user.email;
    } else {
        window.location.href = '/Account/Login';
    }
});

document.getElementById('logoutButton').addEventListener('click', async function() {
    await signOut(auth);
    window.location.href = '/Account/Login';
});