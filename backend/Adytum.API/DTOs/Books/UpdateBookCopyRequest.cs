using Adytum.API.Models;

namespace Adytum.API.DTOs.Books;

public class UpdateBookCopyRequest
{
    public BookCopyCondition Condition { get; set; }

    public bool AvailableForLoan { get; set; }

    public string PersonalNotes { get; set; } = string.Empty;
}