import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    auth,
    db,
    onAuthStateChanged
} from "./firebase.js";

const ordersList = document.getElementById("orders-list");
const ordersError = document.getElementById("orders-error");

// Show an error message
function showError(message) {
    ordersError.textContent = message;
    ordersError.classList.remove("d-none");
}

// Display orders from Firebase
function loadOrders() {

    const ordersRef = ref(db, "orders");

    onValue(ordersRef, snapshot => {

        ordersList.replaceChildren();

        if (!snapshot.exists()) {
            const row = ordersList.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 6;
            cell.className = "text-center";
            cell.textContent = "No orders yet.";
            return;
        }

        snapshot.forEach(child => {

            const order = child.val();
            const orderId = child.key;

            const row = ordersList.insertRow();

            // Order ID
            row.insertCell().textContent = orderId;

            // Customer email
            row.insertCell().textContent = order.userEmail || "Unknown";

            // Order date (Firebase timestamp in milliseconds)
            const date = Number(order.date);
            row.insertCell().textContent =
                Number.isFinite(date) && date > 0
                    ? new Date(date).toLocaleDateString("en-CA")
                    : "Unknown";

            // Total
            const total = Number(order.total);
            row.insertCell().textContent =
                Number.isFinite(total)
                    ? "$" + total.toFixed(2)
                    : "$0.00";

            // Status
            const statusCell = row.insertCell();
            const badge = document.createElement("span");

            badge.className = "badge";
            badge.style.backgroundColor =
                order.status === "Paid" ? "#183E33" : "#BD964F";

            badge.textContent = order.status || "Unknown";
            statusCell.appendChild(badge);

            // Order details link
            const actionCell = row.insertCell();
            const link = document.createElement("a");

            link.href = "/Orders/Details/" +
                encodeURIComponent(orderId);

            link.className = "btn btn-sm text-white";
            link.style.backgroundColor = "#183E33";
            link.textContent = "Details";

            actionCell.appendChild(link);
        });

    }, error => {
        ordersList.replaceChildren();
        showError("Error loading orders: " + error.message);
    });
}

// Wait for Firebase Authentication
onAuthStateChanged(auth, user => {

    if (!user) {
        showError("Please log in to view orders.");
        return;
    }

    loadOrders();
});
