
import { onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { auth, onAuthStateChanged, booksRef } from '/js/firebase.js';

let allBooks = [];

onAuthStateChanged(auth, function(user) {
    if(user) {
        document.getElementById('userEmail').textContent = "Welcome, " + (user.displayName || user.email);
        loadBooks();
    } else {
        window.location.href = '/Account/Login';
    }
});

function loadBooks() {
    onValue(booksRef, function(snapshot) {
        allBooks = [];
        snapshot.forEach(function(child) {
            const book = child.val();
            book.id = child.key;

            // Only show books that are available for sale
            if (book.isAvailable !== false) {
                allBooks.push(book);
            }
        });
        showBooks();
    });
}

function showBooks() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const genre = document.getElementById('genreSelect').value;
    const grid = document.getElementById('bookGrid');

    grid.innerHTML = '';

    for (const book of allBooks) {
        const title = (book.title || "").toLowerCase();
        const author = (book.author || "").toLowerCase();

        const matchesSearch = title.includes(search) || author.includes(search);
        const matchesGenre = genre === 'All' || book.genre === genre;

        if (matchesSearch && matchesGenre) {
            grid.innerHTML += `
                <a class="book-card" href="/Books/Details/${book.id}">
                    <img src="${book.coverUrl}" alt="${book.title}" />
                    <h5>${book.title}</h5>
                    <p>${book.author}</p>
                    <p>${book.genre}</p>
                    <p class="price">$${Number(book.price).toFixed(2)}</p>
                </a>`;
        }
    }

    if (grid.innerHTML === '') {
        grid.innerHTML = '<p>No books found.</p>';
    }
}

document.getElementById('searchInput').addEventListener('input', showBooks);
document.getElementById('genreSelect').addEventListener('change', showBooks);

