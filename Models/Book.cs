namespace NovellaWeb.Models
{
    public class Book
    {
        public string Id { get; set; } = "";
        public string Title { get; set; } = "";
        public string Author { get; set; } = "";
        public string Description { get; set; } = "";
        public string Genre { get; set; } = "";
        public decimal Price { get; set; }
        public string CoverUrl { get; set; } = "";
        public string FileUrl { get; set; } = "";
        public bool IsAvailable { get; set; } = true;
    }
}