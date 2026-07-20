using Adytum.API.DTOs.Books;
using Adytum.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Adytum.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly IBookService _bookService;

    public BooksController(
    IBookService bookService,
    IBookLookupService bookLookupService)
    {
        _bookService = bookService;
        _bookLookupService = bookLookupService;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddBook(AddBookToLibrary request)
    {
        var ownerIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (ownerIdClaim == null)
        {
            return Unauthorized("Utente non autenticato.");
        }

        var ownerId = int.Parse(ownerIdClaim);

        await _bookService.AddBookToLibraryAsync(request, ownerId);

        return Ok("Libro aggiunto alla libreria!");
    }

    [HttpGet("mylibrary")]
    public async Task<IActionResult> GetMyLibrary()
    {
        var ownerIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (ownerIdClaim == null)
        {
            return Unauthorized();
        }

        int ownerId = int.Parse(ownerIdClaim);

        var books = await _bookService.GetMyLibraryAsync(ownerId);

        return Ok(books);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchBooks(string query)
    {
        var results = await _bookService.SearchBooksAsync(query);

        return Ok(results);
    }

    [HttpGet("lookup/{isbn}")]
    public async Task<IActionResult> LookupBook(string isbn)
    {
        var book = await _bookLookupService.GetBookByIsbnAsync(isbn);

        if (book == null)
        {
            return NotFound("Libro non trovato.");
        }

        return Ok(book);
    }
    private readonly IBookLookupService _bookLookupService;
}