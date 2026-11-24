
import { get, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { bookRef, uploadImage, deleteImage } from "./firebase.js";
import { $, readForm, isValid, run, showError, showImage } from "./common.js";

// Get the Edit Book form and book ID
const form = $("edit-form");
const id = form.dataset.id;
let current = null;

// Get the existing book information from Firebase
get(bookRef(id)).then(snap => {
    current = snap.val();

    if (!current) return showError("Book not found");

    // Fill the form with the current book information
    form.elements["Title"].value = current.title ?? "";
    form.elements["Author"].value = current.author ?? "";
    form.elements["Description"].value = current.description ?? "";
    form.elements["Genre"].value = current.genre ?? "";
    form.elements["Price"].value = current.price ?? "";
    form.elements["IsAvailable"].checked = current.isAvailable ?? false;

    // Display the current book cover
    showImage(current.coverUrl);

}).catch(e => showError(e.message));

// Update the book when the form is submitted
form.addEventListener("submit", e => {
    e.preventDefault();

    if (!current) return;

    // Read and validate the updated information
    const book = readForm(form);
    if (!isValid(book)) return;

    run(async () => {
        // Keep the current cover unless a new one is selected
        let coverUrl = current.coverUrl ?? null;

        if (book.cover) {
            coverUrl = await uploadImage(book.cover);
        }

        // Save the updated book in Realtime Database
        await set(bookRef(id), {
            ...current,
            id,
            title: book.title,
            author: book.author,
            description: book.description,
            genre: book.genre,
            price: book.price,
            coverUrl,
            isAvailable: book.isAvailable
        });

        // Delete the old cover only after the book is updated
        if (book.cover && current.coverUrl) {
            await deleteImage(current.coverUrl);
        }

    }, "Book updated!");
});
