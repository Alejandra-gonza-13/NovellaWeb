import {
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    auth,
    ordersRef,
    onAuthStateChanged
} from "./firebase.js";

// Connect HTML elements
const ordersList = document.getElementById("orders-list");
const ordersError = document.getElementById("orders-error");

const searchOrders = document.getElementById("searchOrders");
const filterOrderStatus = document.getElementById("filterOrderStatus");

const totalOrders = document.getElementById("totalOrders");
const paidOrders = document.getElementById("paidOrders");
const ordersRevenue = document.getElementById("ordersRevenue");

let allOrders = [];

// Show error message
function showError(message) {
    ordersError.textContent = message;
    ordersError.classList.remove("d-none");
}

// Show a message in the table
function showTableMessage(message) {
    const row = ordersList.insertRow();
    const cell = row.insertCell();

    cell.colSpan = 6;
    cell.className = "text-center";
    cell.textContent = message;
}

// Update statistics from Firebase orders
function updateStatistics() {

    const paid = allOrders.filter(order =>
        order.status === "Paid"
    );

    const revenue = paid.reduce((sum, order) => {
        const total = Number(order.total);

        return sum + (Number.isFinite(total) ? total : 0);
    }, 0);

    totalOrders.textContent = allOrders.length;
    paidOrders.textContent = paid.length;
    ordersRevenue.textContent = "$" + revenue.toFixed(2);
}

// Display orders using search and status filters
function displayOrders() {

    ordersList.replaceChildren();

    const query = searchOrders.value.toLowerCase().trim();
    const selectedStatus = filterOrderStatus.value;

    const filteredOrders = allOrders.filter(order => {

        const matchesSearch =
            order.id.toLowerCase().includes(query) ||
            (order.userEmail || "").toLowerCase().includes(query);

        const matchesStatus =
            selectedStatus === "All" ||
            order.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    if (filteredOrders.length === 0) {
        showTableMessage(
            allOrders.length === 0
                ? "No orders yet."
                : "No matching orders found."
        );
        return;
    }

    filteredOrders.forEach(order => {

        const row = ordersList.insertRow();

        // Order ID
        row.insertCell().textContent = order.id;

        // Customer email
        row.insertCell().textContent =
            order.userEmail || "Unknown";

        // Order date
        const date = Number(order.date);

        row.insertCell().textContent =
            Number.isFinite(date) && date > 0
                ? new Date(date).toLocaleDateString("en-CA")
                : "Unknown";

        // Order total
        const total = Number(order.total);

        row.insertCell().textContent =
            Number.isFinite(total)
                ? "$" + total.toFixed(2)
                : "Unknown";

        // Order status
        const statusCell = row.insertCell();
        const badge = document.createElement("span");

        badge.className = "badge";
        badge.style.backgroundColor =
            order.status === "Paid" ? "#183E33" : "#BD964F";

        badge.textContent = order.status || "Unknown";
        statusCell.appendChild(badge);

        // Order Details button
        const actionCell = row.insertCell();
        const link = document.createElement("a");

        link.href = "/Orders/Details/" +
            encodeURIComponent(order.id);

        link.className = "btn btn-sm text-white";
        link.style.backgroundColor = "#183E33";
        link.textContent = "Details";

        actionCell.appendChild(link);
    });
}

// Load real orders from Firebase
function loadOrders() {

    onValue(ordersRef, snapshot => {

        allOrders = [];

        snapshot.forEach(child => {

            const order = child.val();

            if (order) {
                allOrders.push({
                    ...order,
                    id: child.key
                });
            }
        });

        // Show newest orders first
        allOrders.sort(
            (a, b) => Number(b.date || 0) - Number(a.date || 0)
        );

        ordersError.classList.add("d-none");

        updateStatistics();
        displayOrders();

    }, error => {
        ordersList.replaceChildren();
        showError("Error loading orders: " + error.message);
    });
}

// Search by email or order ID
searchOrders.addEventListener("input", displayOrders);

// Filter by order status
filterOrderStatus.addEventListener("change", displayOrders);

// Wait for Firebase Authentication
onAuthStateChanged(auth, user => {

    if (!user) {
        showError("Please log in to view orders.");
        return;
    }

    loadOrders();
});
