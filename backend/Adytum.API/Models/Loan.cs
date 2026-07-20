namespace Adytum.API.Models;

public class Loan
{
    public int Id { get; set; }

    public int BookCopyId { get; set; }
    public BookCopy BookCopy { get; set; } = null!;

    public int LenderId { get; set; }
    public User Lender { get; set; } = null!;

    public int BorrowerId { get; set; }
    public User Borrower { get; set; } = null!;

    public DateTime RequestDate { get; set; }

    public DateTime? AcceptedDate { get; set; }

    public DateTime? DueDate { get; set; }

    public DateTime? ReturnedDate { get; set; }

    public LoanStatus Status { get; set; }

}

public enum LoanStatus
    {
        Pending,
        Accepted,
        Rejected,
        Returned,
        Cancelled
    }