namespace Adytum.API.DTOs.Books;

using Adytum.API.Models;

public class SearchBookResult
{
    public int BookCopyId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Author { get; set; } = string.Empty;

    public string CoverImageUrl { get; set; } = string.Empty;

    public string OwnerDisplayName { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public bool AvailableForLoan { get; set; }

    public BookCopyCondition Condition { get; set; }
}

