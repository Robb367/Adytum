namespace Adytum.API.DTOs.Admin;

public class RecentBookDto
{
    public int BookCopyId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string OwnerDisplayName { get; set; } = string.Empty;

    public DateTime AddedAt { get; set; }
}