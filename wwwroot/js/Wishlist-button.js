import { ref, set, remove, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { auth, db, onAuthStateChanged } from '/js/firebase.js';

const bookId = document.getElementById('book-details').dataset.id;
const wishlistButton = document.getElementById('wishlistButton');
const wishlistMessage = document.getElementById('wishlistMessage');

let isSaved = false;
let favoriteRef = null;

onAuthStateChanged(auth, function(user) {
    if (user) {
        // favorites/{userId}/{bookId}
        favoriteRef = ref(db, `favorites/${user.uid}/${bookId}`);

        // Check if the book is already in the wishlist
        onValue(favoriteRef, function(snapshot) {
            isSaved = snapshot.exists();
            wishlistButton.textContent = isSaved ? '♥ In your Wishlist' : '♡ Add to Wishlist';
        });
    }
});

wishlistButton.addEventListener('click', async function() {
    if (!favoriteRef) {
        wishlistMessage.textContent = 'Please log in to use the wishlist.';
        return;
    }

    try {
        if (isSaved) {
            await remove(favoriteRef);
            wishlistMessage.textContent = 'Removed from your wishlist';
        } else {
            await set(favoriteRef, true);
            wishlistMessage.textContent = 'Added to your wishlist';
        }
    } catch (error) {
        wishlistMessage.textContent = error.message;
    }
});