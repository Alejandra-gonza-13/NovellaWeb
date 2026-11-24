import { get, set, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { auth, db, bookRef } from "./firebase.js";
import { $, showError } from "./common.js";

// Get the selected book ID
const id = $("book-details").dataset.id;
const reviewsRef = ref(db, `reviews/${id}`);

// Get the book information from Firebase
get(bookRef(id)).then(snap => {
    const book = snap.val();

    if (!book) return showError("Book not found");

    $("book-title").textContent = book.title ?? "";
    $("book-author").textContent = book.author ?? "";
    $("book-genre").textContent = book.genre ?? "";
    $("book-description").textContent = book.description ?? "";
    $("book-price").textContent = `$${book.price ?? 0}`;

    // Display the book cover
    if (book.coverUrl) {
        $("book-cover").src = book.coverUrl;
        $("book-cover").classList.remove("d-none");
    }

}).catch(e => showError(e.message));

// Display a message
function showMessage(message) {
    $("message").textContent = message;
    $("message").classList.remove("d-none");
}

// Save or update the current user's review
$("review-form").addEventListener("submit", e => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
        showError("Please log in to write a review.");
        return;
    }

    const rating = Number($("rating").value);
    const comment = $("comment").value.trim();

    if (rating < 1 || rating > 5 || !comment) {
        showError("Please enter a rating and comment.");
        return;
    }

    // Each user has one review per book
    const userReviewRef = ref(db, `reviews/${id}/${user.uid}`);

    set(userReviewRef, {
        rating: rating,
        comment: comment,
        userName: user.displayName || "Customer",
        timestamp: Date.now()
    }).then(() => {
        showMessage("Review saved successfully!");
    }).catch(e => showError(e.message));
});

// Display all reviews for this book
onValue(reviewsRef, snapshot => {

    const list = $("reviews-list");
    list.replaceChildren();

    let total = 0;
    let count = 0;

    snapshot.forEach(child => {
        const review = child.val();

        const rating = Number(review.rating);

        if (rating >= 1 && rating <= 5) {
            total += rating;
            count++;
        }

        // Create a review card
        const card = document.createElement("div");
        card.className = "card p-3 mb-3";

        const name = document.createElement("strong");
        name.textContent = review.userName || "Customer";
        name.style.color = "#183E33";

        const stars = document.createElement("p");
        stars.textContent = "★".repeat(Math.max(0, Math.min(5, rating || 0)));
        stars.style.color = "#BD964F";

        const text = document.createElement("p");
        text.textContent = review.comment || "";

        card.append(name, stars, text);

        // Allow users to manage their own reviews
        const user = auth.currentUser;

        if (user && child.key === user.uid) {

            // Load the user's review into the form for editing
            $("rating").value = review.rating;
            $("comment").value = review.comment ?? "";

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete My Review";
            deleteBtn.className = "btn btn-sm btn-outline-danger";

            deleteBtn.addEventListener("click", () => {
                if (!confirm("Delete your review?")) return;

                remove(ref(db, `reviews/${id}/${user.uid}`))
                    .then(() => {
                        $("review-form").reset();
                        showMessage("Review deleted!");
                    })
                    .catch(e => showError(e.message));
            });

            card.appendChild(deleteBtn);
        }

        list.appendChild(card);
    });

    // Display the average rating
    $("average-rating").textContent = count > 0
        ? `★ ${(total / count).toFixed(1)} / 5 (${count} reviews)`
        : "No ratings yet.";

    if (!snapshot.exists()) {
        list.textContent = "No reviews yet.";
        $("review-form").reset();
    }

}, e => showError(e.message));
