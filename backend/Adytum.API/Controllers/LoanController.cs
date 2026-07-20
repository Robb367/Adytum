using Adytum.API.DTOs.Loans;
using Adytum.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Adytum.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LoansController : ControllerBase
{
    private readonly ILoanService _loanService;

    public LoansController(ILoanService loanService)
    {
        _loanService = loanService;
    }

    [HttpPost("request")]
    public async Task<IActionResult> RequestLoan(LoanRequest request)
    {
        var borrowerIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (borrowerIdClaim == null)
        {
            return Unauthorized();
        }

        var borrowerId = int.Parse(borrowerIdClaim);

        var response = await _loanService.RequestLoanAsync(request, borrowerId);

        return Ok(response);
    }

    [HttpGet("received")]
    [Authorize]
    public async Task<IActionResult> GetReceivedLoanRequests()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
            return Unauthorized();

        int lenderId = int.Parse(userIdClaim);

        var requests = await _loanService.GetReceivedLoanRequestsAsync(lenderId);

        return Ok(requests);
    }

    [HttpPost("{loanId}/reject")]
    public async Task<IActionResult> RejectLoan(int loanId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        int lenderId = int.Parse(userIdClaim);

        await _loanService.RejectLoanAsync(loanId, lenderId);

        return Ok(new
        {
            Message = "Richiesta di prestito rifiutata."
        });
    }

    [HttpPost("{loanId}/accept")]
    public async Task<IActionResult> AcceptLoan(int loanId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        int lenderId = int.Parse(userIdClaim);

        await _loanService.AcceptLoanAsync(loanId, lenderId);

        return Ok(new
        {
            Message = "Prestito accettato con successo."
        });
    }

    [HttpGet("sent")]
    public async Task<IActionResult> GetSentLoanRequests()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        int borrowerId = int.Parse(userIdClaim);

        var requests = await _loanService.GetSentLoanRequestsAsync(borrowerId);

        return Ok(requests);
    }

    [HttpPost("{loanId}/return")]
    public async Task<IActionResult> ReturnLoan(int loanId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        int lenderId = int.Parse(userIdClaim);

        await _loanService.ReturnLoanAsync(loanId, lenderId);

        return Ok(new
        {
            Message = "Libro restituito con successo."
        });
    }
}