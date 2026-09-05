namespace Adytum.API.Services.Interfaces;

public interface IImageService
{
    Task<(string OriginalPath, string ThumbnailPath)>
        SaveBookCoverAsync(
            IFormFile file
        );
}