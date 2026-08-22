using Adytum.API.DTOs;
using Adytum.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Adytum.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterUserRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _userService.RegisterUserAsync(request);

        if (!result.Success)
        {
            return Conflict(result.Message);
        }

        return Created(string.Empty, new
        {
            message = result.Message
        });

    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _userService.LoginAsync(request);

        if (!result.Success)
        {
            return Unauthorized(result);
        }

        return Ok(result);
    }

    [HttpGet("search")]
    [Authorize]
    public async Task<IActionResult> SearchUsers(
    [FromQuery] string query)
    {
        var userIdClaim =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var currentUserId =
            int.Parse(userIdClaim);

        var users =
            await _userService.SearchUsersAsync(
                query,
                currentUserId
            );

        return Ok(users);
    }

    [HttpGet("{userId}/available-books")]
    [Authorize]
    public async Task<IActionResult> GetAvailableBooks(
        int userId)
    {
        var books =
            await _userService
                .GetAvailableBooksByUserAsync(userId);

        return Ok(books);
    }

    [HttpGet("{userId}/profile")]
    [Authorize]
    public async Task<IActionResult> GetPublicUserProfile(
        int userId)
    {
        var profile =
            await _userService
                .GetPublicUserProfileAsync(userId);

        return Ok(profile);
    }

}