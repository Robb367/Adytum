using Adytum.API.DTOs;
using Adytum.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

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
}