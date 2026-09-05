import { useState } from "react";
import { login as loginRequest } from "../../../services/AuthService";
import { useAuth } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";

import "./LoginForm.css";

import { useNavigate } from "react-router-dom";

import TextInput from "../../common/TextInput/TextInput";
import PrimaryButton from "../../common/PrimaryButton";

function LoginForm() {

    const navigate = useNavigate();

    const { login: saveToken } = useAuth();

    const [error, setError] = useState("");

    const [loginValue, setLoginValue] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleLogin() {

        if (!loginValue.trim() || !password) {
            setError("Compila tutti i campi.");
            return;
        }

        try {

            setLoading(true);

            setError("");

            const response = await loginRequest({

                login: loginValue,

                password

            });

            if (!response.success) {
                setError(response.message);
                return;
            }

            saveToken(response.token);

            navigate("/dashboard");
        } catch {

            setError("Si è verificato un errore durante il login.");

        }

        finally {

            setLoading(false);

        }

    }
    return (

        <>

            <h2 className="login-title">

                Bentornato, Lettore.

            </h2>

            <p className="login-subtitle">

                Inserisci le tue credenziali.

            </p>

            <div className="login-form">

                <TextInput
                    label="Email o Username"
                    value={loginValue}
                    placeholder="nome@email.it o il tuo username"
                    onChange={setLoginValue}
                />

                <TextInput
                    label="Password"
                    type="password"
                    value={password}
                    placeholder="••••••••"
                    onChange={setPassword}
                />

                <PrimaryButton
                    text={loading ? "Accesso..." : "Entra"}
                    disabled={loading}
                    onClick={handleLogin}
                />

                {error && <p className="login-error">{error}</p>}

                <div className="login-links">

                    <button className="text-link">

                        Hai dimenticato la password?

                    </button>

                    <Link
                        to="/register"
                        className="login-register-link"
                    >
                        Registrati
                    </Link>

                    <button
                        className="text-link"
                        onClick={() => navigate("/")}
                    >

                        ← Torna alla Home

                    </button>

                </div>

            </div>

        </>

    );

}

export default LoginForm;