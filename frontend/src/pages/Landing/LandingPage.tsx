import "./LandingPage.css";

import GlassCard from "../../components/common/GlassCard";
import PageContainer from "../../components/common/PageContainer";
import PrimaryButton from "../../components/common/PrimaryButton";
import SecondaryButton from "../../components/common/SecondaryButton";
import Brand from "../../components/common/Brand";
import { useNavigate } from "react-router-dom";

import background from "../../assets/images/landing-bg.png";

function LandingPage() {

    const navigate = useNavigate();

    return (

        <PageContainer background={background}>

            <GlassCard className="hero-panel">

                <p className="hero-quote">

                    Ogni biblioteca custodisce storie.
                    <br />
                    Questa custodisce anche la tua.

                </p>

                <div className="separator">
                    <span>✦</span>
                </div>

                <Brand size="large" />

                <div className="separator">
                    <span>✦</span>
                </div>

                <h2 className="welcome-title">

                    Salve, Lettore.
                    <br />
                    Benvenuto su Adytum.

                </h2>

                <div className="buttons">

                    <PrimaryButton
                        text="Entra"
                        onClick={() => navigate("/login")}
                    />

                    <SecondaryButton
                        text="Registrati"
                        onClick={() => navigate("/register")}
                    />

                </div>

            </GlassCard>

        </PageContainer>

    );

}

export default LandingPage;