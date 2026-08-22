using Adytum.API.DTOs.Books;
namespace Adytum.API.Services.Interfaces;

public interface IBookService
{
    Task AddBookToLibraryAsync(
        AddBookToLibrary request,
        int ownerId);
    Task DeleteBookCopyAsync(
        int bookCopyId,
        int ownerId
    );
    Task<List<MyLibrary>> GetMyLibraryAsync(int ownerId);
    Task<List<SearchBookResult>> SearchBooksAsync(string query);
    Task<List<BooksNearby>> SearchNearbyBooksAsync(
    string query,
    int userId);
    Task<BookDetailsResponse> GetBookDetailsAsync(int bookCopyId, int currentUserId);
    Task<bool> ToggleBookAvailabilityAsync(int bookCopyId, int ownerId);
    Task UpdateBookCopyAsync(int bookCopyId, int ownerId, UpdateBookCopyRequest request);
    Task UpdateBookCoverAsync(int bookCopyId, int ownerId, UpdateBookCoverRequest request);
    Task RegisterBookViewAsync(int bookCopyId, int viewerId);
}