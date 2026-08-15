const API_ORIGIN = "https://localhost:7100";

export function getImageUrl(
    url: string | null
): string | null {

    if (!url) {
        return null;
    }

    if (
        url.startsWith("http://") ||
        url.startsWith("https://")
    ) {
        return url;
    }

    return `${API_ORIGIN}${url}`;
}