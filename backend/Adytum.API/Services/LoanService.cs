using Adytum.API.DTOs.Loans;
using Adytum.API.Models;
using Adytum.API.Exceptions;
using Adytum.API.Services.Interfaces;
using Adytum.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Adytum.API.Services;

public class LoanService : ILoanService
{
    private readonly AdytumDbContext _context;
    public LoanService(AdytumDbContext context)
    {
        _context = context;
    }
    public async Task<LoanResponse> RequestLoanAsync(LoanRequest request, int borrowerId)
    {
        var bookCopy = await _context.BookCopies
              .Include(b => b.Owner)
              .FirstOrDefaultAsync(b => b.Id == request.BookCopyId);

        if (bookCopy == null)
        {
            throw new NotFoundException("Libro non trovato.");
        }

        if (!bookCopy.AvailableForLoan)
        {
            throw new BusinessRuleException("Questo libro non è disponibile per il prestito.");
        }

        if (bookCopy.OwnerId == borrowerId)
        {
            throw new BusinessRuleException("Non puoi richiedere un prestito per un libro che possiedi.");
        }

        if (bookCopy.OwnerId == borrowerId)
        {
            throw new BusinessRuleException(
                "Non puoi richiedere un prestito per un libro che possiedi."
            );
        }

        if (request.DueDate.Date <= DateTime.UtcNow.Date)
        {
            throw new BusinessRuleException(
                "La data di restituzione deve essere successiva a oggi."
            );
        }

        var existingLoan = await _context.Loans.AnyAsync(l =>
            l.BookCopyId == request.BookCopyId &&
            l.BorrowerId == borrowerId &&
            (l.Status == LoanStatus.Pending || l.Status == LoanStatus.Accepted));

        if (existingLoan)
        {
            throw new BusinessRuleException(
                "Hai già una richiesta di prestito attiva per questo libro.");
        }
        var loan = new Loan
        {
            BookCopyId = bookCopy.Id,
            LenderId = bookCopy.OwnerId,
            BorrowerId = borrowerId,
            RequestDate = DateTime.UtcNow,
            DueDate = request.DueDate,
            Status = LoanStatus.Pending
        };

        _context.Loans.Add(loan);
        await _context.SaveChangesAsync();

        return new LoanResponse
        {
            Success = true,
            Message = "Richiesta di prestito inviata con successo.",
            LoanId = loan.Id,
            Status = loan.Status
        };
    }

    public async Task<List<ReceivedLoanRequest>> GetReceivedLoanRequestsAsync(int lenderId)
    {
        return await _context.Loans
            .Include(l => l.BookCopy)
            .ThenInclude(bc => bc.Book)
            .Include(l => l.Borrower)
            .Where(l => l.LenderId == lenderId)
            .OrderByDescending(l => l.RequestDate)
            .Select(l => new ReceivedLoanRequest
            {
                LoanId = l.Id,
                BookTitle = l.BookCopy.Book.Title,
                BorrowerUsername = l.Borrower.Username,
                BorrowerDisplayName = l.Borrower.DisplayName,
                RequestDate = l.RequestDate,
                DueDate = l.DueDate,
                Status = l.Status
            })
            .ToListAsync();
    }

    public async Task<List<SentLoanRequest>> GetSentLoanRequestsAsync(int borrowerId)
    {
        return await _context.Loans
            .Include(l => l.BookCopy)
            .ThenInclude(bc => bc.Book)
            .Include(l => l.Lender)
            .Where(l => l.BorrowerId == borrowerId)
            .OrderByDescending(l => l.RequestDate)
            .Select(l => new SentLoanRequest
            {
                LoanId = l.Id,
                BookTitle = l.BookCopy.Book.Title,
                LenderUsername = l.Lender.Username,
                LenderDisplayName = l.Lender.DisplayName,
                RequestDate = l.RequestDate,
                DueDate = l.DueDate,
                Status = l.Status
            })
            .ToListAsync();
    }

    public async Task AcceptLoanAsync(int loanId, int lenderId)
    {
        var loan = await _context.Loans
            .Include(l => l.BookCopy)
            .FirstOrDefaultAsync(l => l.Id == loanId);

        if (loan == null)
        {
            throw new NotFoundException("Richiesta di prestito non trovata.");
        }

        if (loan.LenderId != lenderId)
        {
            throw new UnauthorizedException("Non sei autorizzato ad accettare questo prestito.");
        }

        if (loan.Status != LoanStatus.Pending)
        {
            throw new BusinessRuleException("Questa richiesta è già stata gestita.");
        }

        loan.Status = LoanStatus.Accepted;
        loan.AcceptedDate = DateTime.UtcNow;

        var otherRequests = await _context.Loans
    .Where(l =>
        l.BookCopyId == loan.BookCopyId &&
        l.Id != loan.Id &&
        l.Status == LoanStatus.Pending)
    .ToListAsync();

        foreach (var request in otherRequests)
        {
            request.Status = LoanStatus.Rejected;
        }

        loan.BookCopy.AvailableForLoan = false;

        await _context.SaveChangesAsync();
    }

    public async Task RejectLoanAsync(int loanId, int lenderId)
    {
        var loan = await _context.Loans
            .FirstOrDefaultAsync(l => l.Id == loanId);

        if (loan == null)
        {
            throw new NotFoundException("Richiesta di prestito non trovata.");
        }

        if (loan.LenderId != lenderId)
        {
            throw new UnauthorizedException("Non sei autorizzato a rifiutare questo prestito.");
        }

        if (loan.Status != LoanStatus.Pending)
        {
            throw new BusinessRuleException("Questa richiesta è già stata gestita.");
        }

        loan.Status = LoanStatus.Rejected;

        await _context.SaveChangesAsync();
    }
    public async Task ReturnLoanAsync(int loanId, int lenderId)
    {
        var loan = await _context.Loans
            .Include(l => l.BookCopy)
            .FirstOrDefaultAsync(l => l.Id == loanId);

        if (loan == null)
        {
            throw new NotFoundException("Prestito non trovato.");
        }

        if (loan.LenderId != lenderId)
        {
            throw new UnauthorizedException("Non sei autorizzato a registrare la restituzione di questo libro.");
        }

        if (loan.Status != LoanStatus.Accepted)
        {
            throw new BusinessRuleException("Questo prestito non può essere restituito.");
        }

        loan.Status = LoanStatus.Returned;
        loan.ReturnedDate = DateTime.UtcNow;

        loan.BookCopy.AvailableForLoan = true;

        await _context.SaveChangesAsync();
    }
}