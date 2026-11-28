import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { auth, db } from '/js/firebase.js';

const bookId = document.getElementById('book-details').dataset.id;
const cartButton = document.getElementById('cartButton');
const message = document.getElementById('wishlistMessage');

cartButton.addEventListener('click', async function() {
    const user = auth.currentUser;

    if (!user) {
        message.textContent = 'Please log in to add books to your cart.';
        return;
    }

    try {
        
        await set(ref(db, `carts/${user.uid}/${bookId}`), { quantity: 1 });
        message.textContent = 'Added to your cart 🛒';
    } catch (error) {
        message.textContent = error.message;
    }
});