using Microsoft.AspNetCore.Mvc;

namespace Adytum.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "OK",
            application = "Adytum",
            version = "1.0.0"
        });
    }
}