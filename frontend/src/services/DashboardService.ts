import { get } from "./api";

export interface RecentBook {

    bookCopyId: number;
    title: string;
    author: string;
    coverImageUrl: string | null;

}

export interface DashboardViewPoint {
    date: string;
    views: number;
}

export interface MostViewedBook {
    bookCopyId: number;
    title: string;
    author: string;
    coverImageUrl: string | null;
    views: number;
}

export interface DashboardResponse {

    totalBooks: number;
    availableBooks: number;
    activeLoans: number;
    pendingReceivedRequests: number;
    pendingSentRequests: number;
    totalLoansCompleted: number;
    displayName: string;
    recentBooks: RecentBook[];
    latitude: number;
    longitude: number;
    searchRadiusKm: number;
    city: string | null;
    province: string | null;
    mostViewedBook: MostViewedBook | null;
    totalViews: number;
    viewsLast30Days: number;
    viewsByDay: DashboardViewPoint[];

}

export async function getDashboard(

    token: string

): Promise<DashboardResponse> {

    return await get<DashboardResponse>(
        "/Dashboard",
        token
    );

}