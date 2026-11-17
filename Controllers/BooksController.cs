using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using NovellaWeb.Models;

namespace NovellaWeb.Controllers
{
    public class BooksController : Controller
    {
        private static List<Book> books = new List<Book>();

        // READ
        public IActionResult Index()
        {
            return View(books);
        }

        // CREATE
        [HttpGet]
        public IActionResult Create()
        {
            return View(new Book());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Book book)
        {
            if (!ModelState.IsValid)
            {
                return View(book);
            }

            book.Id = Guid.NewGuid().ToString();
            books.Add(book);

            return RedirectToAction("Index");
        }

        // UPDATE
        [HttpGet]
        public IActionResult Edit(string id)
        {
            var book = books.Find(b => b.Id == id);

            if (book == null)
            {
                return NotFound();
            }

            return View(book);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Book book)
        {
            if (!ModelState.IsValid)
            {
                return View(book);
            }

            var existingBook = books.Find(b => b.Id == book.Id);

            if (existingBook == null)
            {
                return NotFound();
            }

            existingBook.Title = book.Title;
            existingBook.Author = book.Author;
            existingBook.Description = book.Description;
            existingBook.Genre = book.Genre;
            existingBook.Price = book.Price;
            existingBook.CoverUrl = book.CoverUrl;
            existingBook.FileUrl = book.FileUrl;
            existingBook.IsAvailable = book.IsAvailable;

            return RedirectToAction("Index");
        }

        // DELETE
        [HttpGet]
        public IActionResult Delete(string id)
        {
            var book = books.Find(b => b.Id == id);

            if (book == null)
            {
                return NotFound();
            }

            return View(book);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(string id)
        {
            var book = books.Find(b => b.Id == id);

            if (book == null)
            {
                return NotFound();
            }

            books.Remove(book);

            return RedirectToAction("Index");
        }
    }
}