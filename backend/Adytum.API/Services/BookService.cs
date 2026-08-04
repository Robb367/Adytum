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

    public BookService(AdytumDbContext context)
    {
        _context = context;
    }

    public async Task AddBookToLibraryAsync(AddBookToLibrary request, int ownerId)
    {
        var book = await _context.Books
            .FirstOrDefaultAsync(b => b.ISBN == request.ISBN);
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
                CoverImageUrl = request.CoverImageUrl
            };

            _context.Books.Add(book);
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
                Title = c.Book.Title,
                Author = c.Book.Author,
                ISBN = c.Book.ISBN,
                AvailableForLoan = c.AvailableForLoan,
                Condition = c.Condition
            })
            .ToListAsync();
    }

    public async Task<List<SearchBookResult>> SearchBooksAsync(string query)
    {
        return await _context.BookCopies
    .Include(c => c.Book)
    .Include(c => c.Owner)
    .Where(c =>
        c.Book.Title.Contains(query) ||
        c.Book.Author.Contains(query))
    .Select(c => new SearchBookResult
    {
        BookCopyId = c.Id,
        Title = c.Book.Title,
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
                    c.Book.Title.Contains(query) ||
                    c.Book.Author.Contains(query)
                ))
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
                    Title = copy.Book.Title,
                    Author = copy.Book.Author,
                    CoverImageUrl = copy.Book.CoverImageUrl,
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
        Title = bookCopy.Book.Title,
        Author = bookCopy.Book.Author,
        ISBN = bookCopy.Book.ISBN,
        Publisher = bookCopy.Book.Publisher,
        PublicationYear = bookCopy.Book.PublicationYear,
        Genre = bookCopy.Book.Genre,
        Language = bookCopy.Book.Language,
        Description = bookCopy.Book.Description,
        CoverImageUrl = bookCopy.Book.CoverImageUrl,
        Condition = bookCopy.Condition,
        AvailableForLoan = bookCopy.AvailableForLoan,
        OwnerDisplayName = bookCopy.Owner.DisplayName,
        City = bookCopy.Owner.City,
        Province = bookCopy.Owner.Province,
        DistanceKm = Math.Round(distance, 2)
    };
}
}
