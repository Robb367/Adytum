import { post } from "./api";

interface LoginRequest {

    login: string;

    password: string;

}

interface LoginResponse {

    success: boolean;
    message: string;
    token: string;

}

export async function login(

    request: LoginRequest

): Promise<LoginResponse> {
// Invia le credenziali al backend e restituisce il token JWT se il login ha successo.
    return await post<LoginResponse>(
        "/Users/login",
        request
    );

}