using Adytum.API.DTOs.BookLookup;
using Adytum.API.Services.Interfaces;

namespace Adytum.API.Services;

public class BookLookupService : IBookLookupService
{
    private readonly IBookLookupProvider _provider;

    public BookLookupService(IBookLookupProvider provider)
    {
        _provider = provider;
    }

    public async Task<BookLookupResponse?> GetBookByIsbnAsync(string isbn)
    {
        return await _provider.LookupAsync(isbn);
    }
}