import { get } from "./api";
import type {
    SearchBookResult
} from "./BookService";

export interface UserSearchResult {
    userId: number;
    username: string;
    displayName: string;
    profilePictureUrl: string | null;
    city: string | null;
    province: string | null;
    availableBooksCount: number;
}

export interface PublicUserProfile {
    userId: number;
    username: string;
    displayName: string;
    profilePictureUrl: string | null;
    bio: string | null;
    city: string | null;
    province: string | null;
    registrationDate: string;
    totalBooks: number;
    availableBooks: number;
    completedLoans: number;
}

export async function searchUsers(
    query: string,
    token: string
): Promise<UserSearchResult[]> {

    return await get<UserSearchResult[]>(
        `/Users/search?query=${encodeURIComponent(query)}`,
        token
    );
}


export async function getPublicUserProfile(
    userId: number,
    token: string
): Promise<PublicUserProfile> {

    return await get<PublicUserProfile>(
        `/Users/${userId}/profile`,
        token
    );
}

export async function getAvailableBooksByUser(
    userId: number,
    token: string
): Promise<SearchBookResult[]> {

    return await get<SearchBookResult[]>(
        `/Users/${userId}/available-books`,
        token
    );
}