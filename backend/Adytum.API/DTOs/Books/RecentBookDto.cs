namespace Adytum.API.DTOs.Dashboard;

public class RecentBookDto
{
    public int BookCopyId { get; set; }

    public string Title { get; set; } = "";

    public string Author { get; set; } = "";

    public string? CoverImageUrl { get; set; }
}