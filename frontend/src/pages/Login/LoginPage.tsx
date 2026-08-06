import { useState } from "react";

import "./LoginPage.css";

import background from "../../assets/images/landing-bg.png";

import PageContainer from "../../components/common/PageContainer";
import GlassCard from "../../components/common/GlassCard";
import Brand from "../../components/common/Brand";
import TextInput from "../../components/common/TextInput/TextInput";
import PrimaryButton from "../../components/common/PrimaryButton";
import { useNavigate } from "react-router-dom";

function LoginPage() {

    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    return (

        <PageContainer background={background}>

            <GlassCard className="login-card">

                <Brand
                    size="medium"
                    subtitle={false}
                />

                <h2 className="login-title">

                    Bentornato, Lettore.

                </h2>

                <p className="login-subtitle">

                    Inserisci le tue credenziali.

                </p>

                <div className="login-form">

                    <TextInput
                        label="Email"
                        value={email}
                        placeholder="nome@email.it"
                        onChange={setEmail}
                    />

                    <TextInput
                        label="Password"
                        type="password"
                        value={password}
                        placeholder="••••••••••"
                        onChange={setPassword}
                    />

                    <PrimaryButton
                        text={loading ? "Accesso..." : "Entra"}
                        disabled={loading}
                    />

                    <div className="login-links">

                        <button
                            className="text-link"
                        >
                            Hai dimenticato la password?
                        </button>

                        <button
                            className="text-link"
                        >
                            Registrati
                        </button>

                        <button
                            className="text-link"
                            onClick={() => navigate("/")}
                        >
                            ← Torna alla Home
                        </button>

                    </div>
                </div>

            </GlassCard>

        </PageContainer>

    );

}

export default LoginPage;