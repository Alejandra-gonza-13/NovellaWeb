using Microsoft.AspNetCore.Mvc;
using NovellaWeb.Models;
using System.Collections.Generic;

namespace NovellaWeb.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            DashboardViewModel dashboard = new DashboardViewModel
            {
                TotalRevenue = 0,
                TotalBooks = 0,
                TotalOrders = 0,
                TotalCustomers = 0,

                MonthlySales = new List<MonthlySale>(),

                BestSellingBooks = new List<BestSellingBook>()
            };

            return View(dashboard);
        }
    }
}