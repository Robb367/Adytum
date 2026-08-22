namespace Adytum.API.DTOs.Dashboard;

public class MostViewedBookDto
{
    public int BookCopyId { get; set; }

    public string Title { get; set; } =
        string.Empty;

    public string Author { get; set; } =
        string.Empty;

    public string? CoverImageUrl { get; set; }

    public int Views { get; set; }
}