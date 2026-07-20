using Adytum.API.DTOs.Loans;
using Adytum.API.Models;

namespace Adytum.API.Services.Interfaces;

public interface ILoanService
{
    Task<LoanResponse> RequestLoanAsync(LoanRequest request, int borrowerId);
     Task<List<ReceivedLoanRequest>> GetReceivedLoanRequestsAsync(int userId);
      Task<List<SentLoanRequest>> GetSentLoanRequestsAsync(int borrowerId);
    Task AcceptLoanAsync(int loanId, int lenderId);
    Task RejectLoanAsync(int loanId, int lenderId);
    Task ReturnLoanAsync(int loanId, int lenderId);
}