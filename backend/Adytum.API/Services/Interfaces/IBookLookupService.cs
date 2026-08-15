using Adytum.API.DTOs.BookLookup;

namespace Adytum.API.Services.Interfaces;

public interface IBookLookupService
{
    Task<BookLookupResponse?> GetBookByIsbnAsync(string isbn);
}
