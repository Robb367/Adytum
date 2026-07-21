using Adytum.API.DTOs.Books;

namespace Adytum.API.Services.Interfaces;

public interface IBookService
{
    Task AddBookToLibraryAsync(
        AddBookToLibrary request,
        int ownerId);

    Task<List<MyLibrary>> GetMyLibraryAsync(int ownerId);
    Task<List<SearchBookResult>> SearchBooksAsync(string query);
    Task<List<BooksNearby>> SearchNearbyBooksAsync(
    string query,
    int userId);
}