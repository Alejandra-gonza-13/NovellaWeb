using NovellaWeb.Models;
using Microsoft.AspNetCore.Mvc;

namespace NovellaWeb.Controllers;

public class OrdersController : Controller
{
    // Temporary data until Firebase integration
    private static List<Order> orders = new List<Order>()
    {
        new Order
        {
            Id = "001",
            CustomerId = "C001",
            CustomerEmail = "emma@example.com",
            OrderDate = new DateTime(2026, 11, 15),
            Total = 25.00,
            Status = "Paid"
        },

        new Order
        {
            Id = "002",
            CustomerId = "C002",
            CustomerEmail = "sofia@example.com",
            OrderDate = new DateTime(2026, 11, 16),
            Total = 15.00,
            Status = "Pending"
        },

        new Order
        {
            Id = "003",
            CustomerId = "C003",
            CustomerEmail = "daniel@example.com",
            OrderDate = new DateTime(2026, 11, 17),
            Total = 32.00,
            Status = "Paid"
        }
    };

    // Display all orders
    public IActionResult Index()
    {
        return View(orders);
    }

    // Display order details
    public IActionResult Details(string id)
    {
        var order = orders.FirstOrDefault(o => o.Id == id);

        if (order == null)
        {
            return NotFound();
        }

        return View(order);
    }
}