using Adytum.API.Models;

namespace Adytum.API.DTOs.Loans;

public class ReceivedLoanRequest
{
    public int LoanId { get; set; }
    public string BookTitle { get; set; } = string.Empty;
    public string BorrowerUsername { get; set; } = string.Empty;
    public string BorrowerDisplayName { get; set; } = string.Empty;
    public DateTime RequestDate { get; set; }
    public DateTime? DueDate { get; set; }
    public LoanStatus Status { get; set; }
}