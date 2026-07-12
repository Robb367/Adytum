namespace Adytum.API.Services.Interfaces;
using Adytum.API.DTOs.BookLookup;

public interface IBookLookupService
{
    Task<BookLookupResponse?> GetBookByIsbnAsync(string isbn);
}