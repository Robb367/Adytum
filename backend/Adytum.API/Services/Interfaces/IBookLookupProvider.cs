using Adytum.API.DTOs.BookLookup;

namespace Adytum.API.Services.Interfaces;

public interface IBookLookupProvider
{
    Task<BookLookupResponse?> LookupAsync(string isbn);
}