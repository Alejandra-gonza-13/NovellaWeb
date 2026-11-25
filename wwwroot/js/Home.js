import { auth, onAuthStateChanged } from '/js/firebase.js';

onAuthStateChanged(auth, function(user) {
    if(user) {
        document.getElementById('userEmail').textContent = "Welcome, " + (user.displayName || user.email);
    } else {
        window.location.href = '/Account/Login';
    }
});
