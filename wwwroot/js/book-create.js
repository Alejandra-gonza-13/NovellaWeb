
import { push, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { booksRef, uploadImage, auth } from "./firebase.js";
import { $, readForm, isValid, run } from "./common.js";

// Get the Add Book form
const form = $("create-form");

// Save a new book when the form is submitted
form.addEventListener("submit", e => {
    e.preventDefault();

    // Read and validate the book information
    const book = readForm(form);
    if (!isValid(book)) return;

    run(async () => {

        // Temporary admin login for testing
        if (!auth.currentUser) {
            const email = prompt("Admin email:");
            const password = prompt("Admin password:");

            if (!email || !password) {
                throw new Error("Admin login required");
            }

            await signInWithEmailAndPassword(auth, email, password);
        }

        // Create a unique ID for the new book
        const newRef = push(booksRef);

        // Upload the book cover to Firebase Storage
        const coverUrl = book.cover
            ? await uploadImage(book.cover)
            : null;

        // Save the book information in Realtime Database
        await set(newRef, {
            id: newRef.key,
            title: book.title,
            author: book.author,
            description: book.description,
            genre: book.genre,
            price: book.price,
            coverUrl,
            isAvailable: book.isAvailable
        });

    }, "Book added!");
});
