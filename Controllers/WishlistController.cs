using Microsoft.AspNetCore.Mvc;

namespace NovellaWeb.Controllers
{
    public class WishlistController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}