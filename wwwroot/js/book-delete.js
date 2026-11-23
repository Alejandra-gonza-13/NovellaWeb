import { get, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { bookRef } from "./firebase.js";
import { $, run, showError, showImage } from "./common.js";

// Get the Delete Book form and book ID
const form = $("delete-form");
const id = form.dataset.id;
let current = null;

// Get the existing book from Firebase
get(bookRef(id)).then(snap => {
    current = snap.val();

    if (!current) return showError("Book not found");

    // Display the book title and price
    $("product-name").textContent = `${current.title} ($${current.price})`;

    // Display the current book cover
    showImage(current.coverUrl);

}).catch(e => showError(e.message));

// Delete the book when the form is submitted
form.addEventListener("submit", e => {
    e.preventDefault();

    if (!current) return;

    run(async () => {
        // Remove the book from Realtime Database
        await remove(bookRef(id));

    }, "Book deleted!");
});
