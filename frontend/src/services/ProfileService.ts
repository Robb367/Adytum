import {
    get,
    put
} from "./api";

export interface ProfileResponse {
    username: string;
    displayName: string;
    email: string;
    bio: string;
    profilePictureUrl: string;

    city: string;
    province: string;

    latitude: number;
    longitude: number;

    searchRadiusKm: number;

    registrationDate: string;

    isPublicProfile: boolean;

    booksOwned: number;
    availableBooks: number;
    activeLoans: number;
    completedLoans: number;
}

export interface UpdateProfileRequest {
    displayName: string;
    bio: string;
    profilePictureUrl: string;

    city: string;
    province: string;

    latitude: number;
    longitude: number;

    searchRadiusKm: number;

    isPublicProfile: boolean;
}

export async function getMyProfile(
    token: string
): Promise<ProfileResponse> {

    return await get<ProfileResponse>(
        "/Profile/me",
        token
    );
}

export async function updateProfile(
    request: UpdateProfileRequest,
    token: string
): Promise<void> {

    await put<{message: string}>(
        "/Profile",
        token,
        request
    );
}