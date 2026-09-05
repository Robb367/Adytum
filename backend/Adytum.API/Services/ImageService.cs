using Adytum.API.Services.Interfaces;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace Adytum.API.Services;

public class ImageService : IImageService
{
    private readonly IWebHostEnvironment _environment;

    public ImageService(
        IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<(
        string OriginalPath,
        string ThumbnailPath
    )> SaveBookCoverAsync(
        IFormFile file)
    {
        var extension =
            Path.GetExtension(
                file.FileName
            ).ToLowerInvariant();

        var allowedExtensions =
            new[]
            {
                ".jpg",
                ".jpeg",
                ".png",
                ".webp"
            };

        if (!allowedExtensions.Contains(extension))
        {
            throw new InvalidOperationException(
                "Formato immagine non supportato."
            );
        }

        if (file.Length > 5 * 1024 * 1024)
        {
            throw new InvalidOperationException(
                "L'immagine non può superare 5 MB."
            );
        }

        var coversDirectory =
            Path.Combine(
                _environment.WebRootPath,
                "covers"
            );

        var thumbnailsDirectory =
            Path.Combine(
                coversDirectory,
                "thumbnails"
            );

        Directory.CreateDirectory(
            coversDirectory
        );

        Directory.CreateDirectory(
            thumbnailsDirectory
        );

        var fileName =
            $"{Guid.NewGuid()}{extension}";

        var originalPhysicalPath =
            Path.Combine(
                coversDirectory,
                fileName
            );

        var thumbnailPhysicalPath =
            Path.Combine(
                thumbnailsDirectory,
                fileName
            );

        await using (
            var stream =
                file.OpenReadStream()
        )
        {
            using var image =
                await Image.LoadAsync(stream);

            await image.SaveAsync(
                originalPhysicalPath
            );

            image.Mutate(context =>
                context.Resize(
                    new ResizeOptions
                    {
                        Size =
                            new Size(
                                300,
                                450
                            ),

                        Mode =
                            ResizeMode.Max
                    }
                )
            );

            await image.SaveAsync(
                thumbnailPhysicalPath
            );
        }

        var originalPath =
            $"/covers/{fileName}";

        var thumbnailPath =
            $"/covers/thumbnails/{fileName}";

        return (
            originalPath,
            thumbnailPath
        );
    }
}