import { onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { booksRef } from "./firebase.js";
import { $, showError } from "./common.js";

// Show a success message after adding, editing or deleting a book
const msg = sessionStorage.getItem("message");
if (msg) {
    $("message").textContent = msg;
    $("message").classList.remove("d-none");
    sessionStorage.removeItem("message");
}

// Get the book row template from Index.cshtml
const template = $("book-row-template");

// Create a table row for each book
function buildRow(book, key) {
    const row = template.content.cloneNode(true);
    const id = encodeURIComponent(book.id ?? key);
    const field = name => row.querySelector(`[data-field="${name}"]`);

    // Display book information
    field("title").textContent = book.title ?? "";
    field("author").textContent = book.author ?? "";
    field("genre").textContent = book.genre ?? "";
    field("price").textContent = book.price ?? 0;

    // Display the book cover if available
    if (book.coverUrl) {
        const img = field("cover");
        img.src = book.coverUrl;
        img.alt = book.title ?? "";
        img.classList.remove("d-none");
    }

    // Set the Edit and Delete links for this book
    for (const action of ["edit", "delete"]) {
        const link = field(action);
        link.href = link.dataset.url.replace("__ID__", id);
    }

    return row;
}

// Read books from Firebase and update the table automatically
onValue(booksRef, snapshot => {
    const body = $("books-body");
    body.replaceChildren();

    snapshot.forEach(child => {
        body.appendChild(buildRow(child.val(), child.key));
    });
}, e => showError(e.message));
