import { post } from "./api";

interface LoginRequest {

    email: string;

    password: string;

}

interface LoginResponse {

    token: string;

}

export async function login(

    request: LoginRequest

): Promise<LoginResponse> {

    return await post<LoginResponse>(
        "/auth/login",
        request
    );

}