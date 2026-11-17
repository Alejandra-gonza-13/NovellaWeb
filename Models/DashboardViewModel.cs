using System.Collections.Generic;

namespace NovellaWeb.Models
{
    public class DashboardViewModel
    {
        public decimal TotalRevenue { get; set; }
        public int TotalBooks { get; set; }
        public int TotalOrders { get; set; }
        public int TotalCustomers { get; set; }

        public List<MonthlySale> MonthlySales { get; set; }
            = new List<MonthlySale>();

        public List<BestSellingBook> BestSellingBooks { get; set; }
            = new List<BestSellingBook>();
    }

    public class MonthlySale
    {
        public string Month { get; set; } = "";
        public decimal Revenue { get; set; }
    }

    public class BestSellingBook
    {
        public string Title { get; set; } = "";
        public int QuantitySold { get; set; }
    }
}