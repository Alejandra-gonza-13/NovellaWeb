using Microsoft.AspNetCore.Mvc;
using NovellaWeb.Models;

namespace NovellaWeb.Controllers;

// All Firebase work happens client-side in wwwroot/js.
public class BooksController : Controller
{
    // Display all books
    public IActionResult Index() => View();

    // Open the Add Book page
    public IActionResult Create() => View(new Book());

    // Open the Edit Book page
    public IActionResult Edit(string id) => View(new Book { Id = id });

    // Open the Delete Book page
    public IActionResult Delete(string id) => View(new Book { Id = id });
}


 // Initially, I used a local list to test the basic CRUD operations.
 // Once the structure was working, I followed the professor's example
 // and moved the database operations to JavaScript and Firebase.
