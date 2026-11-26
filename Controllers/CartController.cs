using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace NovellaWeb.Controllers
{
    public class CartController : Controller
    {
        // ⚠️ Put your Stripe SECRET key here to test.
        // ERASE IT (leave "") before commit, like the teacher said!
        private const string SecretKey = "";
        private const string CheckoutURL = "https://api.stripe.com/v1/checkout/sessions";

        public IActionResult Index()
        {
            return View();
        }

        // Create the Stripe payment and go to the Stripe payment page
        public async Task<IActionResult> Checkout(decimal total)
        {
            if (total <= 0)
            {
                return RedirectToAction("Index");
            }

            // Stripe uses cents: $27.87 -> 2787
            string amount = ((int)Math.Round(total * 100)).ToString();
            string baseUrl = Request.Scheme + "://" + Request.Host;

            // Same as getParams() in the teacher's code
            var parameters = new Dictionary<string, string>
            {
                { "mode", "payment" },
                { "success_url", baseUrl + "/Cart/Success" },
                { "cancel_url", baseUrl + "/Cart/Index" },
                { "line_items[0][price_data][currency]", "cad" },
                { "line_items[0][price_data][product_data][name]", "Novella Bookstore order" },
                { "line_items[0][price_data][unit_amount]", amount },
                { "line_items[0][quantity]", "1" }
            };

            using var client = new HttpClient();

            // Same as getHeaders() in the teacher's code
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + SecretKey);

            var response = await client.PostAsync(CheckoutURL, new FormUrlEncodedContent(parameters));
            string json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return Content("Stripe error: " + json);
            }

            // Read the JSON and get the payment page URL
            using var doc = JsonDocument.Parse(json);
            string url = doc.RootElement.GetProperty("url").GetString();

            return Redirect(url);
        }

        // Stripe comes back here when the payment is successful
        public IActionResult Success()
        {
            return View();
        }
    }
}