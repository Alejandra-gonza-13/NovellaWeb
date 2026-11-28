import { ref, get, push, set, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { auth, db, onAuthStateChanged } from '/js/firebase.js';

const message = document.getElementById('successMessage');
const totalText = document.getElementById('orderTotal');

onAuthStateChanged(auth, function(user) {
    if (user) {
        saveOrder(user);
    } else {
        window.location.href = '/Account/Login';
    }
});

async function saveOrder(user) {
    const cartSnapshot = await get(ref(db, `carts/${user.uid}`));

    // If the cart is empty, the order was already saved
    if (!cartSnapshot.exists()) {
        message.textContent = 'Thank you! Your order is complete.';
        return;
    }

    const items = {};
    let total = 0;

    // Get each book in the cart
    for (const bookId of Object.keys(cartSnapshot.val())) {
        const book = (await get(ref(db, `books/${bookId}`))).val();

        if (book) {
            items[bookId] = {
                title: book.title,
                price: Number(book.price),
                coverUrl: book.coverUrl
            };
            total = total + Number(book.price);
        }
    }

    // orders/{orderId}
    const order = {
        userId: user.uid,
        userEmail: user.email,
        total: Number(total.toFixed(2)),
        date: Date.now(),
        status: 'Paid',
        items: items
    };

    try {
        const newOrderRef = push(ref(db, 'orders'));
        await set(newOrderRef, order);

        // Empty the cart
        await remove(ref(db, `carts/${user.uid}`));

        message.textContent = 'Thank you! Your order was saved.';
        totalText.textContent = 'Total paid: $' + total.toFixed(2);
    } catch (error) {
        message.textContent = error.message;
    }
}