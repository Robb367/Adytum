const API_URL = "https://localhost:7100/api";

export async function post<T>(
    endpoint: string,
    body: unknown
): Promise<T> {

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(body)
        }
    );

    const text = await response.text();

    if (!response.ok) {
        throw new Error(text || "Errore durante la richiesta.");
    }

    return JSON.parse(text);
}

export async function get<T>(
    endpoint: string,
    token: string
): Promise<T> {

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            method: "GET",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error(
            `Errore durante la richiesta. Status: ${response.status}`
        );
    }

    return await response.json();
}

export async function patch<T>(
    endpoint: string,
    token: string
): Promise<T> {

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            method: "PATCH",

            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error(
            `Errore durante la richiesta. Status: ${response.status}`
        );
    }

    return await response.json();
}

export async function put<T>(
    endpoint: string,
    token: string,
    body: unknown
): Promise<T> {

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(body)
        }
    );

    if (!response.ok) {
        throw new Error(
            `Errore durante la richiesta. Status: ${response.status}`
        );
    }

    return await response.json();
}

export async function postAuthenticated<T>(
    endpoint: string,
    token: string,
    body?: unknown
): Promise<T> {

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: body
                ? JSON.stringify(body)
                : undefined
        }
    );

    if (!response.ok) {

        const text = await response.text();

        throw new Error(
            text || "Errore durante la richiesta."
        );
    }

    return await response.json();
}