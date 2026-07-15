namespace Adytum.API.Models;

using Microsoft.EntityFrameworkCore;

[Index(nameof(ISBN), IsUnique = true)]
public class Book
{
    public ICollection<BookCopy> Copies { get; set; } = new List<BookCopy>();

    public int Id { get; set; }

    public string ISBN { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Author { get; set; } = string.Empty;

    public string Publisher { get; set; } = string.Empty;

    public int PublicationYear { get; set; }

    public string Language { get; set; } = string.Empty;

    public string Translator { get; set; } = string.Empty;

    public string Genre { get; set; } = string.Empty;

    public int Pages { get; set; }

    public string Description { get; set; } = string.Empty;

    public string CoverImageUrl { get; set; } = string.Empty;
}