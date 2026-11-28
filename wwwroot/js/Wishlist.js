import {ref, get, remove, onValue} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { auth, db, onAuthStateChanged } from '/js/firebase.js';

const grid = document.getElementById('wishlistGrid');
let userId = null;

onAuthStateChanged(auth, function(user) {
    if (user) {
        userId = user.uid;
        loadWishlist();
    } else {
        window.location.href = '/Account/Login';
    }
});

function loadWishlist() {
    onValue(ref(db, `favorites/${userId}`), async function(snapshot) {

        if (!snapshot.exists()) {
            grid.innerHTML = '<p>Your wishlist is empty.</p>';
            return;
        }

        const bookIds = []
        snapshot.forEach(function(child) {
            bookIds.push(child.key);
        });

        let html = '';
        for (const bookId of bookIds) {
            const bookSnapshot = await get(ref(db, `books/${bookId}`));
            const book = bookSnapshot.val();

            if (book) {
                html += `
                    <div class="book-card">
                        <a href="/Books/Details/${bookId}">
                            <img src="${book.coverUrl}" alt="${book.title}" />
                        </a>
                        <h5>${book.title}</h5>
                        <p>${book.author}</p>
                        <p class="price">$${Number(book.price).toFixed(2)}</p>
                        <button class="btn btn-gold w-100 remove-button" data-id="${bookId}">Remove</button>
                    </div>`;
            }
        }

        grid.innerHTML = html;

    });
}

grid.addEventListener('click', async function(e) {
    const id = e.target.dataset.id;
    if (id) {
        await remove(ref(db, `favorites/${userId}/${id}`));
    }
});
