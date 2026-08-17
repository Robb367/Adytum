namespace Adytum.API.DTOs.Books;

public class UpdateBookCoverRequest
{
    public IFormFile? CoverImage { get; set; }

    public string? CoverImageUrl { get; set; }
}