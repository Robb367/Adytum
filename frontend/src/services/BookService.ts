import { get, put, patch } from "./api";

export interface LibraryBook {
    bookCopyId: number;
    title: string;
    author: string;
    isbn: string;
    availableForLoan: boolean;
    condition: number;
    coverImageUrl: string | null;
}

export async function getMyLibrary(
    token: string
): Promise<LibraryBook[]> {

    return await get<LibraryBook[]>(
        "/Books/mylibrary",
        token
    );
}
export interface BookDetails {
    bookCopyId: number;
    title: string;
    author: string;
    isbn: string;
    publisher: string;
    publicationYear: number;
    genre: string;
    language: string;
    description: string;
    coverImageUrl: string | null;
    condition: number;
    availableForLoan: boolean;
    ownerDisplayName: string;
    city: string;
    province: string;
    distanceKm: number;
    isOwnedByCurrentUser: boolean;
    personalNotes: string;
}

export interface UpdateBookCopyRequest {
    condition: number;
    availableForLoan: boolean;
    personalNotes: string;
}

export async function getBookDetails(
    bookCopyId: number,
    token: string
): Promise<BookDetails> {

    return await get<BookDetails>(
        `/Books/${bookCopyId}`,
        token
    );
}

interface UpdateBookCopyResponse {
    message: string;
}

export async function updateBookCopy(
    bookCopyId: number,
    request: UpdateBookCopyRequest,
    token: string
): Promise<void> {

    await put<UpdateBookCopyResponse>(
        `/Books/${bookCopyId}`,
        token,
        request
    );
}

interface ToggleAvailabilityResponse {
    availableForLoan: boolean;
}

export async function toggleBookAvailability(
    bookCopyId: number,
    token: string
): Promise<boolean> {

    const response =
        await patch<ToggleAvailabilityResponse>(
            `/Books/${bookCopyId}/availability`,
            token
        );

    return response.availableForLoan;
}

export interface SearchBookResult {
    bookCopyId: number;
    title: string;
    author: string;
    coverImageUrl: string | null;
    ownerDisplayName: string;
    city: string;
    availableForLoan: boolean;
    condition: number;
}

export interface NearbyBook {
    bookCopyId: number;
    title: string;
    author: string;
    coverImageUrl: string | null;
    ownerDisplayName: string;
    city: string;
    province: string;
    distanceKm: number;
    availableForLoan: boolean;
}

export async function searchBooks(
    query: string,
    token: string
): Promise<SearchBookResult[]> {

    return await get<SearchBookResult[]>(
        `/Books/search?query=${encodeURIComponent(query)}`,
        token
    );
}

export async function searchNearbyBooks(
    query: string,
    token: string
): Promise<NearbyBook[]> {

    return await get<NearbyBook[]>(
        `/Books/nearby?query=${encodeURIComponent(query)}`,
        token
    );
}