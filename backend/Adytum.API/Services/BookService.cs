using Adytum.API.Data;
using Adytum.API.Models;
using Adytum.API.Services.Interfaces;
using Adytum.API.DTOs.Books;
using Adytum.API.Helpers;
using Adytum.API.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Adytum.API.Services;

public class BookService : IBookService
{
    private readonly AdytumDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public BookService(
        AdytumDbContext context,
        IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }
    public async Task<bool> ToggleBookAvailabilityAsync(int bookCopyId, int ownerId)
    {
        var bookCopy = await _context.BookCopies
            .FirstOrDefaultAsync(b => b.Id == bookCopyId && b.OwnerId == ownerId);

        if (bookCopy == null)
            throw new NotFoundException("Copia del libro non trovata o non appartiene all'utente.");

        bookCopy.AvailableForLoan = !bookCopy.AvailableForLoan;

        await _context.SaveChangesAsync();

        return bookCopy.AvailableForLoan;
    }
    public async Task AddBookToLibraryAsync(
    AddBookToLibrary request,
    int ownerId)
    {
        var book = await _context.Books
            .FirstOrDefaultAsync(b => b.ISBN == request.ISBN);

        string? coverImageUrl = request.CoverImageUrl;

        // Se l'utente ha caricato una copertina manualmente,
        // salviamo il file localmente.
        if (request.CoverImage != null)
        {
            var extension = Path.GetExtension(
                request.CoverImage.FileName)
                .ToLowerInvariant();

            var allowedExtensions = new[]
            {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        };

            if (!allowedExtensions.Contains(extension))
            {
                throw new BusinessRuleException(
                    "Formato copertina non supportato. " +
                    "Sono ammessi JPG, JPEG, PNG e WEBP.");
            }

            const long maxFileSize = 5 * 1024 * 1024;

            if (request.CoverImage.Length > maxFileSize)
            {
                throw new BusinessRuleException(
                    "La copertina non può superare i 5 MB.");
            }

            var coversFolder = Path.Combine(
                _environment.WebRootPath,
                "covers");

            Directory.CreateDirectory(coversFolder);

            var fileName =
                $"{Guid.NewGuid()}{extension}";

            var filePath = Path.Combine(
                coversFolder,
                fileName);

            await using var stream =
                new FileStream(
                    filePath,
                    FileMode.Create);

            await request.CoverImage.CopyToAsync(stream);

            coverImageUrl = $"/covers/{fileName}";
        }

        if (book == null)
        {
            book = new Book
            {
                ISBN = request.ISBN,
                Title = request.Title,
                Author = request.Author,
                Publisher = request.Publisher,
                PublicationYear = request.PublicationYear,
                Language = request.Language,
                Translator = request.Translator,
                Genre = request.Genre,
                Pages = request.Pages,
                Description = request.Description,
                CoverImageUrl = coverImageUrl
            };

            _context.Books.Add(book);
        }
        else if (
            !string.IsNullOrWhiteSpace(coverImageUrl) &&
            string.IsNullOrWhiteSpace(book.CoverImageUrl))
        {
            // Se il libro esiste già ma non ha una copertina,
            // utilizziamo quella fornita adesso.
            book.CoverImageUrl = coverImageUrl;
        }

        var bookCopy = new BookCopy
        {
            Book = book,
            OwnerId = ownerId,
            Condition = request.Condition,
            AvailableForLoan = request.AvailableForLoan,
            PersonalNotes = request.PersonalNotes,
            CreatedAt = DateTime.UtcNow
        };

        _context.BookCopies.Add(bookCopy);

        await _context.SaveChangesAsync();
    }

    public async Task<List<MyLibrary>> GetMyLibraryAsync(int ownerId)
    {
        return await _context.BookCopies
            .Where(c => c.OwnerId == ownerId)
            .Include(c => c.Book)
            .Select(c => new MyLibrary
            {
                BookCopyId = c.Id,
                Title = c.CustomTitle ?? c.Book.Title,
                Author = c.CustomAuthor ?? c.Book.Author,
                ISBN = c.Book.ISBN,
                AvailableForLoan = c.AvailableForLoan,
                Condition = c.Condition,
                CoverImageUrl = c.CustomCoverImageUrl ?? c.Book.CoverImageUrl,
            })
            .ToListAsync();
    }

    public async Task DeleteBookCopyAsync(
        int bookCopyId,
        int ownerId)
    {
        var bookCopy = await _context.BookCopies
            .Include(c => c.Book)
            .FirstOrDefaultAsync(c =>
                c.Id == bookCopyId &&
                c.OwnerId == ownerId);

        if (bookCopy == null)
        {
            throw new NotFoundException(
                "Libro non trovato nella tua biblioteca."
            );
        }

        var hasActiveLoans =
            await _context.Loans.AnyAsync(l =>
                l.BookCopyId == bookCopyId &&
                (
                    l.Status == LoanStatus.Pending ||
                    l.Status == LoanStatus.Accepted
                )
            );

        if (hasActiveLoans)
        {
            throw new BusinessRuleException(
                "Non puoi rimuovere questo libro mentre esistono richieste o prestiti attivi."
            );
        }

        _context.BookCopies.Remove(bookCopy);

        await _context.SaveChangesAsync();
    }
    public async Task UpdateBookCopyAsync(
    int bookCopyId,
    int ownerId,
    UpdateBookCopyRequest request)
    {
        var bookCopy = await _context.BookCopies
            .FirstOrDefaultAsync(c =>
                c.Id == bookCopyId &&
                c.OwnerId == ownerId);

        if (bookCopy == null)
        {
            throw new NotFoundException(
                "Libro non trovato nella tua biblioteca."
            );
        }

        bookCopy.Condition = request.Condition;

        bookCopy.AvailableForLoan =
            request.AvailableForLoan;

        bookCopy.PersonalNotes =
            request.PersonalNotes;

        await _context.SaveChangesAsync();
    }

    public async Task UpdateBookCoverAsync(
        int bookCopyId,
        int ownerId,
        UpdateBookCoverRequest request)
    {
        var bookCopy = await _context.BookCopies
            .FirstOrDefaultAsync(c =>
                c.Id == bookCopyId &&
                c.OwnerId == ownerId);

        if (bookCopy == null)
        {
            throw new NotFoundException(
                "Libro non trovato nella tua biblioteca."
            );
        }

        string? coverImageUrl = null;

        // Se viene caricato un file, ha la precedenza sull'URL.
        if (request.CoverImage != null)
        {
            var extension = Path
                .GetExtension(request.CoverImage.FileName)
                .ToLowerInvariant();

            var allowedExtensions = new[]
            {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        };

            if (!allowedExtensions.Contains(extension))
            {
                throw new BusinessRuleException(
                    "Formato copertina non supportato. " +
                    "Sono ammessi JPG, JPEG, PNG e WEBP."
                );
            }

            const long maxFileSize =
                5 * 1024 * 1024;

            if (request.CoverImage.Length > maxFileSize)
            {
                throw new BusinessRuleException(
                    "La copertina non può superare i 5 MB."
                );
            }

            var coversFolder = Path.Combine(
                _environment.WebRootPath,
                "covers"
            );

            Directory.CreateDirectory(
                coversFolder
            );

            var fileName =
                $"{Guid.NewGuid()}{extension}";

            var filePath = Path.Combine(
                coversFolder,
                fileName
            );

            await using var stream =
                new FileStream(
                    filePath,
                    FileMode.Create
                );

            await request.CoverImage
                .CopyToAsync(stream);

            coverImageUrl =
                $"/covers/{fileName}";
        }

        // Se non abbiamo un file, proviamo l'URL.
        else if (!string.IsNullOrWhiteSpace(
            request.CoverImageUrl))
        {
            var url =
                request.CoverImageUrl.Trim();

            if (
                !Uri.TryCreate(
                    url,
                    UriKind.Absolute,
                    out var uri
                )
                ||
                (
                    uri.Scheme != Uri.UriSchemeHttp &&
                    uri.Scheme != Uri.UriSchemeHttps
                )
            )
            {
                throw new BusinessRuleException(
                    "L'URL della copertina non è valido."
                );
            }

            coverImageUrl = url;
        }
        else
        {
            throw new BusinessRuleException(
                "Seleziona una copertina oppure inserisci un URL."
            );
        }

        bookCopy.CustomCoverImageUrl =
            coverImageUrl;

        await _context.SaveChangesAsync();
    }
    public async Task<List<SearchBookResult>> SearchBooksAsync(string query)
    {
        return await _context.BookCopies
    .Include(c => c.Book)
    .Include(c => c.Owner)
    .Where(c =>
        (c.CustomTitle ?? c.Book.Title).Contains(query) ||
        (c.CustomAuthor ?? c.Book.Author).Contains(query))
    .Select(c => new SearchBookResult
    {
        BookCopyId = c.Id,
        Title = c.CustomTitle ?? c.Book.Title,
        Author = c.Book.Author,
        CoverImageUrl = c.Book.CoverImageUrl,
        OwnerDisplayName = c.Owner.DisplayName,
        City = c.Owner.City,
        AvailableForLoan = c.AvailableForLoan,
        Condition = c.Condition
    })
    .ToListAsync();
    }

    public async Task<List<BooksNearby>> SearchNearbyBooksAsync(
    string query,
    int userId)
    {
        query = query.Trim();

        if (string.IsNullOrWhiteSpace(query))
        {
            return new List<BooksNearby>();
        }

        var user = await _context.Users.FindAsync(userId);

        if (user == null)
            throw new NotFoundException("Utente non trovato.");

        var bookCopies = await _context.BookCopies
            .Include(c => c.Book)
            .Include(c => c.Owner)
            .Where(c =>
                c.AvailableForLoan &&
                (
                    (c.CustomTitle ?? c.Book.Title).Contains(query) ||
                    (c.CustomAuthor ?? c.Book.Author).Contains(query))
                )
            .ToListAsync();

        var results = new List<BooksNearby>();

        foreach (var copy in bookCopies)
        {
            // Evita di mostrare i propri libri
            if (copy.OwnerId == userId)
                continue;

            var distance = GeoHelper.CalculateDistanceKm(
                user.Latitude,
                user.Longitude,
                copy.Owner.Latitude,
                copy.Owner.Longitude);

            if (distance <= user.SearchRadiusKm)
            {
                results.Add(new BooksNearby
                {
                    BookCopyId = copy.Id,
                    Title = copy.CustomTitle ?? copy.Book.Title,
                    Author = copy.CustomAuthor ?? copy.Book.Author,
                    CoverImageUrl = copy.CustomCoverImageUrl ?? copy.Book.CoverImageUrl,
                    OwnerDisplayName = copy.Owner.DisplayName,
                    City = copy.Owner.City,
                    Province = copy.Owner.Province,
                    DistanceKm = Math.Round(distance, 2),
                    AvailableForLoan = copy.AvailableForLoan
                });
            }
        }

        return results
            .OrderBy(b => b.DistanceKm)
            .ToList();
    }

    public async Task<BookDetailsResponse> GetBookDetailsAsync(
    int bookCopyId,
    int currentUserId)
    {
        var currentUser = await _context.Users.FindAsync(currentUserId);

        if (currentUser == null)
            throw new NotFoundException("Utente non trovato.");

        var bookCopy = await _context.BookCopies
            .Include(b => b.Book)
            .Include(b => b.Owner)
            .FirstOrDefaultAsync(b => b.Id == bookCopyId);

        if (bookCopy == null)
            throw new NotFoundException("Libro non trovato.");

        var distance = GeoHelper.CalculateDistanceKm(
            currentUser.Latitude,
            currentUser.Longitude,
            bookCopy.Owner.Latitude,
            bookCopy.Owner.Longitude);

        return new BookDetailsResponse
        {
            BookCopyId = bookCopy.Id,
            Title = bookCopy.CustomTitle ?? bookCopy.Book.Title,
            Author = bookCopy.CustomAuthor ?? bookCopy.Book.Author,
            ISBN = bookCopy.Book.ISBN,
            Publisher = bookCopy.CustomPublisher ?? bookCopy.Book.Publisher,
            PublicationYear = bookCopy.CustomPublicationYear ?? bookCopy.Book.PublicationYear,
            Genre = bookCopy.CustomGenre ?? bookCopy.Book.Genre,
            Language = bookCopy.Book.Language,
            Pages = bookCopy.CustomPages ?? bookCopy.Book.Pages,
            Description = bookCopy.CustomDescription ?? bookCopy.Book.Description,
            CoverImageUrl = bookCopy.CustomCoverImageUrl ?? bookCopy.Book.CoverImageUrl,
            Condition = bookCopy.Condition,
            AvailableForLoan = bookCopy.AvailableForLoan,
            OwnerDisplayName = bookCopy.Owner.DisplayName,
            City = bookCopy.Owner.City,
            IsOwnedByCurrentUser = bookCopy.OwnerId == currentUserId,
            Province = bookCopy.Owner.Province,
            DistanceKm = Math.Round(distance, 2),
            PersonalNotes = bookCopy.PersonalNotes
        };
    }

}
