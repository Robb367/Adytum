using Adytum.API.Models;
namespace Adytum.API.DTOs.Books;

public class MyLibrary
{
    public int BookCopyId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Author { get; set; } = string.Empty;

    public string ISBN { get; set; } = string.Empty;

    public bool AvailableForLoan { get; set; }

    public BookCopyCondition Condition { get; set; }
    public string? CoverImageUrl { get; set; }
}