using Microsoft.AspNetCore.Mvc;

namespace NovellaWeb.Controllers;

public class OrdersController : Controller
{
    // Display all orders from Firebase
    public IActionResult Index()
    {
        return View();
    }

    // Display selected order details
    public IActionResult Details(string id)
    {
        if (string.IsNullOrEmpty(id))
        {
            return NotFound();
        }

        ViewBag.OrderId = id;

        return View();
    }
}
