import { get } from "./api";

export interface NearbyUser {

    userId: number;

    displayName: string;

    city: string | null;

    province: string | null;

    latitude: number;

    longitude: number;

    distanceKm: number;

    availableBooksCount: number;

}

export async function getNearbyUsers(
    token: string
): Promise<NearbyUser[]> {

    return await get<NearbyUser[]>(
        "/Map/nearby-users",
        token
    );
}