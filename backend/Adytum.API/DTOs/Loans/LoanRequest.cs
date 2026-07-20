namespace Adytum.API.DTOs.Loans;

public class LoanRequest
{
    public int BookCopyId { get; set; }

    public DateTime DueDate { get; set; }
}