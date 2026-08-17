using Adytum.API.Models;

namespace Adytum.API.DTOs.Books;

public class UpdateBookCopyRequest
{
    public string? CustomTitle { get; set; }

    public string? CustomAuthor { get; set; }

    public string? CustomPublisher { get; set; }

    public int? CustomPublicationYear { get; set; }

    public string? CustomGenre { get; set; }

    public int? CustomPages { get; set; }

    public string? CustomDescription { get; set; }

    public BookCopyCondition Condition { get; set; }

    public bool AvailableForLoan { get; set; }

    public string? PersonalNotes { get; set; }
}