const API_URL = "https://localhost:7001/api";

export async function post<T>(
    endpoint: string,
    body: unknown
): Promise<T> {

    const response = await fetch(`${API_URL}${endpoint}`, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(body)

    });

    if (!response.ok) {

        throw new Error("Errore durante la richiesta.");

    }

    return await response.json();

}