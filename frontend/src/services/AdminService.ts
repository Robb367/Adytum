import { get } from "./api";

export interface RecentUser {
    id: number;
    displayName: string;
    username: string;
    registrationDate: string;
}

export interface RecentBook {
    bookCopyId: number;
    title: string;
    ownerDisplayName: string;
    addedAt: string;
}

export interface AdminActivityPoint {
    date: string;
    newUsers: number;
    newBooks: number;
}

export interface AdminDashboardResponse {
    totalUsers: number;
    totalBooks: number;
    totalBookCopies: number;
    activeLoans: number;
    completedLoans: number;
    pendingRequests: number;
    recentUsers: RecentUser[];
    recentBooks: RecentBook[];
    activityLast30Days: AdminActivityPoint[];
}

export async function getAdminDashboard(
    token: string
): Promise<AdminDashboardResponse> {

    return await get<AdminDashboardResponse>(
        "/Admin/dashboard",
        token
    );
}