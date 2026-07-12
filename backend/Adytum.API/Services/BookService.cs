using Adytum.API.Data;
using Adytum.API.Models;
using Adytum.API.Services.Interfaces;
using Adytum.API.DTOs.Books;
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
}
