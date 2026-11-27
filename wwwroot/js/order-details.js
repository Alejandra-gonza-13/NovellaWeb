import {
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    auth,
    orderRef,
    onAuthStateChanged
} from "./firebase.js";

// Get selected order ID
const orderId = document.getElementById("order-details")
    .dataset.orderId;

// Show error message
function showError(message) {
    const error = document.getElementById("order-error");
    error.textContent = message;
    error.classList.remove("d-none");
}

// Load order details from Firebase
async function loadOrder() {

    try {
        const snapshot = await get(orderRef(orderId));

        if (!snapshot.exists()) {
            showError("Order not found.");
            return;
        }

        const order = snapshot.val();

        // Display order information
        document.getElementById("order-title").textContent =
            "Order #" + orderId;

        document.getElementById("order-id").textContent =
            orderId;

        document.getElementById("customer-id").textContent =
            order.userId || "Unknown";

        document.getElementById("customer-email").textContent =
            order.userEmail || "Unknown";

        const date = Number(order.date);

        document.getElementById("order-date").textContent =
            Number.isFinite(date) && date > 0
                ? new Date(date).toLocaleDateString("en-CA")
                : "Unknown";

        const total = Number(order.total);

        document.getElementById("order-total").textContent =
            Number.isFinite(total)
                ? "$" + total.toFixed(2)
                : "Unknown";

        // Display order status
        const status = document.getElementById("order-status");

        status.textContent = order.status || "Unknown";
        status.style.backgroundColor =
            order.status === "Paid" ? "#183E33" : "#BD964F";

        // Display purchased books
        const itemsContainer =
            document.getElementById("order-items");

        itemsContainer.replaceChildren();

        if (!order.items) {
            itemsContainer.textContent = "No books found.";
            return;
        }

        Object.entries(order.items).forEach(([bookId, book]) => {

            const row = document.createElement("div");
            row.className = "d-flex align-items-center gap-3 mb-3 p-2 border-bottom";

            // Book cover
            const cover = document.createElement("img");
            cover.alt = "Book Cover";
            cover.style.width = "65px";
            cover.style.height = "90px";
            cover.style.objectFit = "contain";

            if (book.coverUrl) {
                cover.src = book.coverUrl;
            }

            // Book information
            const info = document.createElement("div");
            info.className = "flex-grow-1";

            const title = document.createElement("strong");
            title.textContent = book.title || "Unknown Book";
            title.style.color = "#183E33";

            const price = document.createElement("p");
            price.className = "mb-0";

            const bookPrice = Number(book.price);
            price.textContent = Number.isFinite(bookPrice)
                ? "$" + bookPrice.toFixed(2)
                : "Price unavailable";

            info.append(title, price);
            row.append(cover, info);
            itemsContainer.appendChild(row);
        });

    } catch (error) {
        showError("Error loading order: " + error.message);
    }
}

// Wait for Firebase login
onAuthStateChanged(auth, user => {

    if (!user) {
        showError("Please log in to view order details.");
        return;
    }

    loadOrder();
});
