namespace Adytum.API.Models;

public class BookView
{
    public int Id { get; set; }

    public int BookCopyId { get; set; }

    public BookCopy BookCopy { get; set; } = null!;

    public int ViewerId { get; set; }

    public User Viewer { get; set; } = null!;

    public DateTime ViewedAt { get; set; } =
        DateTime.UtcNow;
}