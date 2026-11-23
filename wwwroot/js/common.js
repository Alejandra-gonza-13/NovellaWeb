// Get an HTML element by its ID
export const $ = id => document.getElementById(id);

// Display an error message
export function showError(msg) {
    const el = $("error");
    if (el) {
        el.textContent = msg;
        el.classList.remove("d-none");
    } else alert(msg);
}

// Display the current book cover
export function showImage(url) {
    const img = $("current-image");
    if (url && img) {
        img.src = url;
        img.classList.remove("d-none");
    }
}

// Read the book information from the form
export function readForm(form) {
    const data = new FormData(form);

    // Get the cover image and PDF file
    const cover = data.get("cover");
    const pdf = data.get("pdf");

    return {
        title: data.get("Title")?.trim() ?? "",
        author: data.get("Author")?.trim() ?? "",
        description: data.get("Description")?.trim() ?? "",
        genre: data.get("Genre")?.trim() ?? "",
        price: parseFloat(data.get("Price")),
        isAvailable: data.get("IsAvailable") !== null,
        cover: cover && cover.size ? cover : null,
        pdf: pdf && pdf.size ? pdf : null
    };
}

// Check if the required book information is valid
export function isValid(book) {
    if (!book.title || !book.author || !book.description ||
        !book.genre || isNaN(book.price) || book.price < 0) {
        showError("Please complete all required fields.");
        return false;
    }
    return true;
}

// Run a Firebase action and return to the books list
export async function run(action, message) {
    try {
        await action();

        // Save a success message for the next page
        sessionStorage.setItem("message", message);

        // Return to Manage Books
        location.href = "/Books";
    } catch (e) {
        console.error(e);
        showError(e.message);
    }
}
