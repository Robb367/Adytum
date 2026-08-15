import "./LoginPage.css";

import background from "../../assets/images/landing-bg.png";

import PageContainer from "../../components/common/PageContainer";
import GlassCard from "../../components/common/GlassCard";
import Brand from "../../components/common/Brand";

import LoginForm from "../../components/auth/LoginForm/LoginForm";

function LoginPage() {

    return (

        <PageContainer background={background}>

            <GlassCard className="login-card">

                <Brand
                    size="medium"
                    subtitle={false}
                />

                <LoginForm />

            </GlassCard>

        </PageContainer>

    );

}

export default LoginPage;