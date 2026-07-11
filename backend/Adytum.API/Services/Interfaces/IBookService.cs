using Adytum.API.DTOs.Books;

namespace Adytum.API.Services.Interfaces;

public interface IBookService
{
    Task AddBookToLibraryAsync(
        AddBookToLibrary request,
        int ownerId);
}