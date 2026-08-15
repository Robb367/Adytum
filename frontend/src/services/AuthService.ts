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

    return await post<LoginResponse>(
        "/Users/login",
        request
    );

}