import { get, postAuthenticated } from "./api";

export interface LoanRequest {
    bookCopyId: number;
    dueDate: string;
}

export interface LoanResponse {
    success: boolean;
    message: string;
    loanId: number;
    status: number;
}

export interface ReceivedLoanRequest {
    loanId: number;
    bookTitle: string;
    borrowerUsername: string;
    borrowerDisplayName: string;
    requestDate: string;
    dueDate: string;
    status: number;
}

export interface SentLoanRequest {
    loanId: number;
    bookTitle: string;
    lenderUsername: string;
    lenderDisplayName: string;
    requestDate: string;
    dueDate: string;
    status: number;
}

export async function requestLoan(
    request: LoanRequest,
    token: string
): Promise<LoanResponse> {

    return await postAuthenticated<LoanResponse>(
        "/Loans/request",
        token,
        request
    );
}

export async function getReceivedLoans(
    token: string
): Promise<ReceivedLoanRequest[]> {

    return await get<ReceivedLoanRequest[]>(
        "/Loans/received",
        token
    );
}

export async function getSentLoans(
    token: string
): Promise<SentLoanRequest[]> {

    return await get<SentLoanRequest[]>(
        "/Loans/sent",
        token
    );
}

interface LoanActionResponse {
    message: string;
}

export async function acceptLoan(
    loanId: number,
    token: string
): Promise<void> {

    await postAuthenticated<LoanActionResponse>(
        `/Loans/${loanId}/accept`,
        token
    );
}

export async function rejectLoan(
    loanId: number,
    token: string
): Promise<void> {

    await postAuthenticated<LoanActionResponse>(
        `/Loans/${loanId}/reject`,
        token
    );
}

export async function returnLoan(
    loanId: number,
    token: string
): Promise<void> {

    await postAuthenticated<LoanActionResponse>(
        `/Loans/${loanId}/return`,
        token
    );
}