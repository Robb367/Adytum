using Adytum.API.DTOs.Books;
using Adytum.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Adytum.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly IBookService _bookService;

    public BooksController(IBookService bookService)
    {
        _bookService = bookService;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddBook(AddBookToLibrary request)
    {
        const int ownerId = 1; // temporaneo

        await _bookService.AddBookToLibraryAsync(request, ownerId);

        return Ok("Libro aggiunto alla libreria!");
    }
}