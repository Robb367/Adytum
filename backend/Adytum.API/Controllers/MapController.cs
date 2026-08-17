using Adytum.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Adytum.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MapController : ControllerBase
{
    private readonly IMapService _mapService;

    public MapController(
        IMapService mapService)
    {
        _mapService = mapService;
    }

    [HttpGet("nearby-users")]
    public async Task<IActionResult> GetNearbyUsers()
    {
        var userIdClaim =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId =
            int.Parse(userIdClaim);

        var users =
            await _mapService
                .GetNearbyUsersAsync(userId);

        return Ok(users);
    }
}