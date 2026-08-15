import "./DashboardHeader.css";

interface DashboardHeaderProps {

    displayName: string;

}

function DashboardHeader({
    displayName
}: DashboardHeaderProps) {

    return (

        <header className="dashboard-header">

            <div>

                <p className="dashboard-eyebrow">
                    La tua biblioteca
                </p>

                <h1>
                    Salve, {displayName}.
                </h1>

                <p className="dashboard-welcome">
                    Bentornato nella tua biblioteca.
                </p>

            </div>

        </header>

    );

}

export default DashboardHeader;