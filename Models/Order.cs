using System.ComponentModel.DataAnnotations;

namespace NovellaWeb.Models;

public class Order
{
    public string? Id { get; set; }

    [Required]
    public string CustomerId { get; set; } = "";

    [Required]
    public string CustomerEmail { get; set; } = "";

    public DateTime OrderDate { get; set; }

    [Required, Range(0, double.MaxValue)]
    public double Total { get; set; }

    [Required]
    public string Status { get; set; } = "";
}