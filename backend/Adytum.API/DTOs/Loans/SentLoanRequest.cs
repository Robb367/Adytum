using Adytum.API.Models;

namespace Adytum.API.DTOs.Loans;

public class SentLoanRequest
{
    public int LoanId { get; set; }

    public string BookTitle { get; set; } = string.Empty;

    public string LenderUsername { get; set; } = string.Empty;
    public string LenderDisplayName { get; set; } = string.Empty;

    public DateTime RequestDate { get; set; }

    public DateTime? DueDate { get; set; }

    public LoanStatus Status { get; set; }
}