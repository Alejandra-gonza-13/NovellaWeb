import { ref, get, remove, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { auth, db, onAuthStateChanged } from '/js/firebase.js';

const grid = document.getElementById('cartGrid');
const summary = document.getElementById('cartSummary');
const totalText = document.getElementById('cartTotal');
let userId = null;

onAuthStateChanged(auth, function(user) {
    if (user) {
        userId = user.uid;
        loadCart();
    } else {
        window.location.href = '/Account/Login';
    }
});

// Read carts/{userId} and then each book
function loadCart() {
    onValue(ref(db, `carts/${userId}`), async function(snapshot) {

        if (!snapshot.exists()) {
            grid.innerHTML = '<p>Your cart is empty.</p>';
            summary.style.display = 'none';
            return;
        }

        const bookIds = [];
        snapshot.forEach(function(child) {
            bookIds.push(child.key);
        });

        let html = '';
        let total = 0;

        for (const bookId of bookIds) {
            const bookSnapshot = await get(ref(db, `books/${bookId}`));
            const book = bookSnapshot.val();

            if (book) {
                total = total + Number(book.price);
                html += `
                    <div class="book-card">
                        <a href="/Books/Details/${bookId}">
                            <img src="${book.coverUrl}" alt="${book.title}" />
                        </a>
                        <h5>${book.title}</h5>
                        <p>${book.author}</p>
                        <p class="price">$${Number(book.price).toFixed(2)}</p>
                        <button class="btn btn-gold w-100 mt-2" data-id="${bookId}">Remove</button>
                    </div>`;
            }
        }

        grid.innerHTML = html;
        totalText.textContent = '$' + total.toFixed(2);
        summary.style.display = 'block';
        document.getElementById('checkoutButton').href = `/Cart/Checkout?total=${total.toFixed(2)}`;
    });
}

// Remove a book from the cart
grid.addEventListener('click', async function(e) {
    const id = e.target.dataset.id;
    if (id) {
        await remove(ref(db, `carts/${userId}/${id}`));
    }
});