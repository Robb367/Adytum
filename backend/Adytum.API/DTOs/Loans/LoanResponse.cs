using Adytum.API.Models;

namespace Adytum.API.DTOs.Loans;

public class LoanResponse
{
    public bool Success { get; set; }

    public string Message { get; set; } = string.Empty;

    public int LoanId { get; set; }

    public LoanStatus Status { get; set; }
}