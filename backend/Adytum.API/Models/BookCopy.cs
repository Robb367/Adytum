namespace Adytum.API.Models;

public class BookCopy
{
    public int Id { get; set; }

    public int BookId { get; set; }

    public Book Book { get; set; } = null!;

    public int OwnerId { get; set; }

    public User Owner { get; set; } = null!;

    public BookCopyCondition Condition { get; set; }

    public bool AvailableForLoan { get; set; }

    public string? PersonalNotes { get; set; }

    public DateTime CreatedAt { get; set; }

    public ICollection<Loan> Loans { get; set; } = new List<Loan>();
}
