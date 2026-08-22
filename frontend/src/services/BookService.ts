import { get, put, patch, remove, postAuthenticated, postFormData } from "./api";

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
    isbn: string | null;
    publisher: string | null;
    publicationYear: number | null;
    genre: string | null;
    language: string | null;
    pages: number | null;
    description: string | null;
    coverImageUrl: string | null;
    condition: number;
    availableForLoan: boolean;
    ownerDisplayName: string;
    city: string | null;
    province: string | null;
    distanceKm: number;
    isOwnedByCurrentUser: boolean;
    personalNotes: string | null;
}

export interface UpdateBookCopyRequest {
    condition: number;
    availableForLoan: boolean;
    personalNotes: string | null;
    customTitle: string | null;
    customAuthor: string | null;
    customPublisher: string | null;
    customPublicationYear: number | null;
    customGenre: string | null;
    customPages: number | null;
    customDescription: string | null;
}

export async function deleteBookCopy(
    bookCopyId: number,
    token: string
): Promise<void> {

    await remove(
        `/Books/${bookCopyId}`,
        token
    );
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

export async function updateBookCover(
    bookCopyId: number,
    token: string,
    coverFile: File | null,
    coverUrl: string
): Promise<void> {

    const formData =
        new FormData();

    if (coverFile) {

        formData.append(
            "CoverImage",
            coverFile
        );

    }
    else if (coverUrl.trim()) {

        formData.append(
            "CoverImageUrl",
            coverUrl.trim()
        );

    }

    await postFormData(
        `/Books/${bookCopyId}/cover`,
        token,
        formData
    );
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

export async function registerBookView(
    bookCopyId: number,
    token: string
): Promise<void> {

    await postAuthenticated(
        `/Books/${bookCopyId}/view`,
        token
    );
}

export interface BookLookupResponse {
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    publicationYear: number;
    language: string;
    pages: number;
    description: string;
    coverImageUrl: string | null;
}

export async function lookupBookByIsbn(
    isbn: string,
    token: string
): Promise<BookLookupResponse | null> {

    const response = await fetch(
        `https://localhost:7100/api/Books/lookup/${encodeURIComponent(isbn)}`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(
            `Errore lookup ISBN. Status: ${response.status}`
        );
    }

    return await response.json();
}
export interface AddBookRequest {
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    publicationYear: number | null;
    language: string;
    translator: string;
    genre: string;
    pages: number | null;
    description: string;
    coverImageUrl: string;
    condition: number;
    availableForLoan: boolean;
    personalNotes: string;
    coverImage: File | null;
}

export async function addBookToLibrary(
    request: AddBookRequest,
    token: string
): Promise<void> {

    const formData = new FormData();

    formData.append("ISBN", request.isbn);
    formData.append("Title", request.title);
    formData.append("Author", request.author);
    formData.append("Publisher", request.publisher);

    if (request.publicationYear !== null) {
        formData.append(
            "PublicationYear",
            request.publicationYear.toString()
        );
    }

    formData.append("Language", request.language);
    formData.append("Translator", request.translator);
    formData.append("Genre", request.genre);

    if (request.pages !== null) {
        formData.append(
            "Pages",
            request.pages.toString()
        );
    }

    formData.append(
        "Description",
        request.description
    );

    formData.append(
        "CoverImageUrl",
        request.coverImageUrl
    );

    formData.append(
        "Condition",
        request.condition.toString()
    );

    formData.append(
        "AvailableForLoan",
        request.availableForLoan.toString()
    );

    formData.append(
        "PersonalNotes",
        request.personalNotes
    );

    if (request.coverImage) {

        formData.append(
            "CoverImage",
            request.coverImage
        );

    }

    const response = await fetch(
        "https://localhost:7100/api/Books/add",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        }
    );

    if (!response.ok) {

        const text =
            await response.text();

        throw new Error(
            text ||
            "Errore durante l'aggiunta del libro."
        );
    }
}