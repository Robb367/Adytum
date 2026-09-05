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
    private readonly IImageService _imageService;

    public BookService(
        AdytumDbContext context,
        IImageService imageService)
    {
        _context = context;
        _imageService = imageService;
    }

    // DISPONIBILITÀ DELLA COPIA DEL LIBRO

    public async Task<bool> ToggleBookAvailabilityAsync(
        int bookCopyId,
        int ownerId)
    {
        var bookCopy =
            await _context.BookCopies
                .FirstOrDefaultAsync(b =>
                    b.Id == bookCopyId &&
                    b.OwnerId == ownerId
                );

        if (bookCopy == null)
        {
            throw new NotFoundException(
                "Copia del libro non trovata o non appartiene all'utente."
            );
        }

        bookCopy.AvailableForLoan =
            !bookCopy.AvailableForLoan;

        await _context.SaveChangesAsync();

        return bookCopy.AvailableForLoan;
    }

    // AGGIUNTA LIBRO

    public async Task AddBookToLibraryAsync(
        AddBookToLibrary request,
        int ownerId)
    {
        var book =
            await _context.Books
                .FirstOrDefaultAsync(b =>
                    b.ISBN == request.ISBN
                );


        string? coverImageUrl =
            string.IsNullOrWhiteSpace(
                request.CoverImageUrl
            )
                ? null
                : request.CoverImageUrl.Trim();


        string? thumbnailImageUrl =
            null;


        string? customCoverImageUrl =
            null;

        // COVER CARICATA DA FILE
    
        if (request.CoverImage != null)
        {
            var (
                originalPath,
                thumbnailPath
            ) =
                await _imageService
                    .SaveBookCoverAsync(
                        request.CoverImage
                    );

            coverImageUrl =
                originalPath;

            thumbnailImageUrl =
                thumbnailPath;
        }


        // LIBRO NON ANCORA PRESENTE

        if (book == null)
        {
            book = new Book
            {
                ISBN =
                    request.ISBN,

                Title =
                    request.Title,

                Author =
                    request.Author,

                Publisher =
                    request.Publisher,

                PublicationYear =
                    request.PublicationYear,

                Language =
                    request.Language,

                Translator =
                    request.Translator,

                Genre =
                    request.Genre,

                Pages =
                    request.Pages,

                Description =
                    request.Description,

                CoverImageUrl =
                    coverImageUrl
            };

            _context.Books.Add(book);
        }

        // LIBRO GIÀ PRESENTE

        else if (
            !string.IsNullOrWhiteSpace(
                coverImageUrl
            )
        )
        {
            // Se l'entità condivisa non ha ancora una cover,
            // possiamo assegnarle quella appena fornita.
            if (
                string.IsNullOrWhiteSpace(
                    book.CoverImageUrl
                )
            )
            {
                book.CoverImageUrl =
                    coverImageUrl;
            }

            // Se invece il libro ha già una cover diversa,
            // quella nuova resta personalizzata sulla copia.
            else if (
                !string.Equals(
                    book.CoverImageUrl,
                    coverImageUrl,
                    StringComparison.OrdinalIgnoreCase
                )
            )
            {
                customCoverImageUrl =
                    coverImageUrl;
            }
        }


        // CREAZIONE COPIA DELL'UTENTE

        var bookCopy =
            new BookCopy
            {
                Book =
                    book,

                OwnerId =
                    ownerId,

                Condition =
                    request.Condition,

                AvailableForLoan =
                    request.AvailableForLoan,

                PersonalNotes =
                    request.PersonalNotes,

                CustomCoverImageUrl =
                    customCoverImageUrl,

                ThumbnailImageUrl =
                    thumbnailImageUrl,

                CreatedAt =
                    DateTime.UtcNow
            };


        _context.BookCopies.Add(
            bookCopy
        );

        await _context.SaveChangesAsync();
    }

    // BIBLIOTECA PERSONALE

    public async Task<List<MyLibrary>>
        GetMyLibraryAsync(
            int ownerId)
    {
        return await _context.BookCopies

            .Where(c =>
                c.OwnerId == ownerId
            )

            .Include(c =>
                c.Book
            )

            .Select(c =>
                new MyLibrary
                {
                    BookCopyId =
                        c.Id,

                    Title =
                        c.CustomTitle
                        ?? c.Book.Title,

                    Author =
                        c.CustomAuthor
                        ?? c.Book.Author,

                    ISBN =
                        c.Book.ISBN,

                    AvailableForLoan =
                        c.AvailableForLoan,

                    Condition =
                        c.Condition,

                    CoverImageUrl =
                        c.CustomCoverImageUrl
                        ?? c.Book.CoverImageUrl,

                    ThumbnailUrl =
                        c.ThumbnailImageUrl
                }
            )

            .ToListAsync();
    }


    // ELIMINAZIONE COPIA (solo utente loggato)

    public async Task DeleteBookCopyAsync(
        int bookCopyId,
        int ownerId)
    {
        var bookCopy =
            await _context.BookCopies

                .Include(c =>
                    c.Book
                )

                .FirstOrDefaultAsync(c =>
                    c.Id == bookCopyId &&
                    c.OwnerId == ownerId
                );


        if (bookCopy == null)
        {
            throw new NotFoundException(
                "Libro non trovato nella tua biblioteca."
            );
        }


        var hasActiveLoans =
            await _context.Loans
                .AnyAsync(l =>
                    l.BookCopyId == bookCopyId &&
                    (
                        l.Status ==
                            LoanStatus.Pending
                        ||
                        l.Status ==
                            LoanStatus.Accepted
                    )
                );


        if (hasActiveLoans)
        {
            throw new BusinessRuleException(
                "Non puoi rimuovere questo libro mentre esistono richieste o prestiti attivi."
            );
        }


        _context.BookCopies.Remove(
            bookCopy
        );

        await _context.SaveChangesAsync();
    }

    // MODIFICA DATI DELLA COPIA (ovviamente solo utente loggato)

    public async Task UpdateBookCopyAsync(
        int bookCopyId,
        int ownerId,
        UpdateBookCopyRequest request)
    {
        var bookCopy =
            await _context.BookCopies
                .FirstOrDefaultAsync(c =>
                    c.Id == bookCopyId &&
                    c.OwnerId == ownerId
                );


        if (bookCopy == null)
        {
            throw new NotFoundException(
                "Libro non trovato nella tua biblioteca."
            );
        }


        bookCopy.CustomTitle =
            request.CustomTitle;

        bookCopy.CustomAuthor =
            request.CustomAuthor;

        bookCopy.CustomPublisher =
            request.CustomPublisher;

        bookCopy.CustomPublicationYear =
            request.CustomPublicationYear;

        bookCopy.CustomGenre =
            request.CustomGenre;

        bookCopy.CustomPages =
            request.CustomPages;

        bookCopy.CustomDescription =
            request.CustomDescription;

        bookCopy.Condition =
            request.Condition;

        bookCopy.AvailableForLoan =
            request.AvailableForLoan;

        bookCopy.PersonalNotes =
            request.PersonalNotes;


        await _context.SaveChangesAsync();
    }

    
    // MODIFICA COPERTINA

    public async Task UpdateBookCoverAsync(
        int bookCopyId,
        int ownerId,
        UpdateBookCoverRequest request)
    {
        var bookCopy =
            await _context.BookCopies
                .FirstOrDefaultAsync(c =>
                    c.Id == bookCopyId &&
                    c.OwnerId == ownerId
                );


        if (bookCopy == null)
        {
            throw new NotFoundException(
                "Libro non trovato nella tua biblioteca."
            );
        }


        // FILE LOCALE


        if (request.CoverImage != null)
        {
            var (
                originalPath,
                thumbnailPath
            ) =
                await _imageService
                    .SaveBookCoverAsync(
                        request.CoverImage
                    );


            bookCopy.CustomCoverImageUrl =
                originalPath;

            bookCopy.ThumbnailImageUrl =
                thumbnailPath;
        }

      
        // URL REMOTO
     
        else if (
            !string.IsNullOrWhiteSpace(
                request.CoverImageUrl
            )
        )
        {
            var url =
                request.CoverImageUrl
                    .Trim();


            if (
                !Uri.TryCreate(
                    url,
                    UriKind.Absolute,
                    out var uri
                )
                ||
                (
                    uri.Scheme !=
                        Uri.UriSchemeHttp
                    &&
                    uri.Scheme !=
                        Uri.UriSchemeHttps
                )
            )
            {
                throw new BusinessRuleException(
                    "L'URL della copertina non è valido."
                );
            }


            bookCopy.CustomCoverImageUrl =
                url;


            // Per le immagini remote non genera una thumbnail locale

            bookCopy.ThumbnailImageUrl =
                null;
        }

        else
        {
            throw new BusinessRuleException(
                "Seleziona una copertina oppure inserisci un URL."
            );
        }


        await _context.SaveChangesAsync();
    }

    // RICERCA GLOBALE LIBRI
   
    public async Task<List<SearchBookResult>>
        SearchBooksAsync(
            string query)
    {
        query =
            query.Trim();


        if (
            string.IsNullOrWhiteSpace(
                query
            )
        )
        {
            return new List<SearchBookResult>();
        }


        return await _context.BookCopies

            .Include(c =>
                c.Book
            )

            .Include(c =>
                c.Owner
            )

            .Where(c =>
                (
                    c.CustomTitle
                    ?? c.Book.Title
                ).Contains(query)
                ||
                (
                    c.CustomAuthor
                    ?? c.Book.Author
                ).Contains(query)
            )

            .Select(c =>
                new SearchBookResult
                {
                    BookCopyId =
                        c.Id,

                    Title =
                        c.CustomTitle
                        ?? c.Book.Title,

                    Author =
                        c.CustomAuthor
                        ?? c.Book.Author,

                    CoverImageUrl =
                        c.CustomCoverImageUrl
                        ?? c.Book.CoverImageUrl,

                    ThumbnailUrl =
                        c.ThumbnailImageUrl,

                    OwnerDisplayName =
                        c.Owner.DisplayName,

                    City =
                        c.Owner.City,

                    AvailableForLoan =
                        c.AvailableForLoan,

                    Condition =
                        c.Condition
                }
            )

            .ToListAsync();
    }


    // RICERCA LIBRI NELLE VICINANZE


    public async Task<List<BooksNearby>>
        SearchNearbyBooksAsync(
            string query,
            int userId)
    {
        query =
            query.Trim();


        if (
            string.IsNullOrWhiteSpace(
                query
            )
        )
        {
            return new List<BooksNearby>();
        }


        var user =
            await _context.Users
                .FindAsync(
                    userId
                );


        if (user == null)
        {
            throw new NotFoundException(
                "Utente non trovato."
            );
        }


        var bookCopies =
            await _context.BookCopies

                .Include(c =>
                    c.Book
                )

                .Include(c =>
                    c.Owner
                )

                .Where(c =>
                    c.AvailableForLoan
                    &&
                    (
                        (
                            c.CustomTitle
                            ?? c.Book.Title
                        ).Contains(query)
                        ||
                        (
                            c.CustomAuthor
                            ?? c.Book.Author
                        ).Contains(query)
                    )
                )

                .ToListAsync();


        var results =
            new List<BooksNearby>();


        foreach (
            var copy in bookCopies
        )
        {
            // Non si vedono i libri appartenenti all'utente stesso, non avrebbe senso e crea confusione

            if (
                copy.OwnerId ==
                userId
            )
            {
                continue;
            }


            var distance =
                GeoHelper.CalculateDistanceKm(
                    user.Latitude,
                    user.Longitude,
                    copy.Owner.Latitude,
                    copy.Owner.Longitude
                );


            if (
                distance <=
                user.SearchRadiusKm
            )
            {
                results.Add(
                    new BooksNearby
                    {
                        BookCopyId =
                            copy.Id,

                        Title =
                            copy.CustomTitle
                            ?? copy.Book.Title,

                        Author =
                            copy.CustomAuthor
                            ?? copy.Book.Author,

                        CoverImageUrl =
                            copy.CustomCoverImageUrl
                            ?? copy.Book.CoverImageUrl,

                        ThumbnailUrl =
                            copy.ThumbnailImageUrl,

                        OwnerDisplayName =
                            copy.Owner.DisplayName,

                        City =
                            copy.Owner.City,

                        Province =
                            copy.Owner.Province,

                        DistanceKm =
                            Math.Round(
                                distance,
                                2
                            ),

                        AvailableForLoan =
                            copy.AvailableForLoan
                    }
                );
            }
        }


        return results

            .OrderBy(b =>
                b.DistanceKm
            )

            .ToList();
    }


    // REGISTRAZIONE VISUALIZZAZIONE

    public async Task RegisterBookViewAsync(
        int bookCopyId,
        int viewerId)
    {
        var bookCopy =
            await _context.BookCopies
                .FirstOrDefaultAsync(c =>
                    c.Id == bookCopyId
                );


        if (bookCopy == null)
        {
            throw new NotFoundException(
                "Libro non trovato."
            );
        }


        // Il proprietario non genera visualizzazioni sul proprio libro, altrimenti il conteggio delle visualizzazioni sarebbe distorto
        if (
            bookCopy.OwnerId ==
            viewerId
        )
        {
            return;
        }


        var threshold =
            DateTime.UtcNow
                .AddMinutes(-30);


        var recentViewExists =
            await _context.BookViews
                .AnyAsync(v =>
                    v.BookCopyId ==
                        bookCopyId
                    &&
                    v.ViewerId ==
                        viewerId
                    &&
                    v.ViewedAt >=
                        threshold
                );


        if (recentViewExists)
        {
            return;
        }


        var view =
            new BookView
            {
                BookCopyId =
                    bookCopyId,

                ViewerId =
                    viewerId,

                ViewedAt =
                    DateTime.UtcNow
            };


        _context.BookViews.Add(
            view
        );

        await _context.SaveChangesAsync();
    }


    // DETTAGLIO LIBRO


    public async Task<BookDetailsResponse>
        GetBookDetailsAsync(
            int bookCopyId,
            int currentUserId)
    {
        var currentUser =
            await _context.Users
                .FindAsync(
                    currentUserId
                );


        if (currentUser == null)
        {
            throw new NotFoundException(
                "Utente non trovato."
            );
        }


        var bookCopy =
            await _context.BookCopies

                .Include(b =>
                    b.Book
                )

                .Include(b =>
                    b.Owner
                )

                .FirstOrDefaultAsync(b =>
                    b.Id == bookCopyId
                );


        if (bookCopy == null)
        {
            throw new NotFoundException(
                "Libro non trovato."
            );
        }


        var distance =
            GeoHelper.CalculateDistanceKm(
                currentUser.Latitude,
                currentUser.Longitude,
                bookCopy.Owner.Latitude,
                bookCopy.Owner.Longitude
            );


        return new BookDetailsResponse
        {
            BookCopyId =
                bookCopy.Id,

            Title =
                bookCopy.CustomTitle
                ?? bookCopy.Book.Title,

            Author =
                bookCopy.CustomAuthor
                ?? bookCopy.Book.Author,

            ISBN =
                bookCopy.Book.ISBN,

            Publisher =
                bookCopy.CustomPublisher
                ?? bookCopy.Book.Publisher,

            PublicationYear =
                bookCopy.CustomPublicationYear
                ?? bookCopy.Book.PublicationYear,

            Genre =
                bookCopy.CustomGenre
                ?? bookCopy.Book.Genre,

            Language =
                bookCopy.Book.Language,

            Pages =
                bookCopy.CustomPages
                ?? bookCopy.Book.Pages,

            Description =
                bookCopy.CustomDescription
                ?? bookCopy.Book.Description,

            CoverImageUrl =
                bookCopy.CustomCoverImageUrl
                ?? bookCopy.Book.CoverImageUrl,

            Condition =
                bookCopy.Condition,

            AvailableForLoan =
                bookCopy.AvailableForLoan,

            OwnerDisplayName =
                bookCopy.Owner.DisplayName,

            City =
                bookCopy.Owner.City,

            Province =
                bookCopy.Owner.Province,

            DistanceKm =
                Math.Round(
                    distance,
                    2
                ),

            IsOwnedByCurrentUser =
                bookCopy.OwnerId ==
                currentUserId,

            PersonalNotes =
                bookCopy.PersonalNotes
        };
    }
}