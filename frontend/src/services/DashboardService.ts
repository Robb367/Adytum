import { get } from "./api";

export interface RecentBook {

    bookCopyId: number;

    title: string;

    author: string;

    coverUrl: string | null;

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

}

export async function getDashboard(

    token: string

): Promise<DashboardResponse> {

    return await get<DashboardResponse>(
        "/Dashboard",
        token
    );

}