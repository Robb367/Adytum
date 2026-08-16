import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { post } from "../../services/api";

import "./RegisterPage.css";

interface RegisterResponse {
    message: string;
}

function RegisterPage() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Le password non coincidono.");
            return;
        }

        try {

            setLoading(true);

            const response =
                await post<RegisterResponse>(
                    "/Users/register",
                    {
                        username,
                        email,
                        displayName,
                        password
                    }
                );

            setSuccess(response.message);

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        }
        catch (err) {

    console.error(
        "Errore registrazione:",
        err
    );

    if (err instanceof Error) {

        try {

            const parsed = JSON.parse(err.message);

            const firstValidationError =
                parsed?.errors
                    ? Object.values(parsed.errors)[0]
                    : null;

            if (
                Array.isArray(firstValidationError) &&
                firstValidationError.length > 0
            ) {

                setError(
                    firstValidationError[0] as string
                );

                return;
            }

        }
        catch {
            // La response non era JSON:
            // usiamo direttamente il messaggio.
        }

        setError(err.message);

    }
    else {

        setError(
            "Non è stato possibile completare la registrazione."
        );

    }
}

    }
    return (
        <main className="register-page">

            <section className="register-card">

                <p className="register-eyebrow">
                    ADYTUM
                </p>

                <h1>
                    Crea il tuo account
                </h1>

                <p className="register-subtitle">
                    Entra nella biblioteca condivisa
                    e costruisci la tua collezione.
                </p>

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >

                    <label>
                        Username

                        <input
                            type="text"
                            value={username}
                            maxLength={30}
                            required
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                        />
                    </label>

                    <label>
                        Nome visualizzato

                        <input
                            type="text"
                            value={displayName}
                            maxLength={100}
                            onChange={(event) =>
                                setDisplayName(event.target.value)
                            }
                        />
                    </label>

                    <label>
                        Email

                        <input
                            type="email"
                            value={email}
                            required
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                        />
                    </label>

                    <label>
                        Password

                        <input
                            type="password"
                            value={password}
                            required
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />
                    </label>

                    <p className="password-hint">
                        Almeno 8 caratteri, una maiuscola,
                        una minuscola, un numero e un carattere speciale.
                    </p>

                    <label>
                        Conferma password

                        <input
                            type="password"
                            value={confirmPassword}
                            required
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                        />
                    </label>

                    {error && (
                        <p className="register-error">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="register-success">
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {
                            loading
                                ? "Registrazione..."
                                : "Registrati"
                        }
                    </button>

                </form>

                <button
                    type="button"
                    className="register-login-link"
                    onClick={() =>
                        navigate("/login")
                    }
                >
                    Hai già un account? Accedi
                </button>

            </section>

        </main>
    );
}

export default RegisterPage;