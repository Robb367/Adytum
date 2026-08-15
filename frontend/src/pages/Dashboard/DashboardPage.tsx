import { useEffect, useState } from "react";

import { useAuth } from "../../contexts/AuthContext";

import { useNavigate } from "react-router-dom";

import {
    getDashboard,
    type DashboardResponse
} from "../../services/DashboardService";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import "./DashboardPage.css";
import StatCard from "../../components/dashboard/StatCard";
import RecentBooks from "../../components/dashboard/RecentBooks";

function DashboardPage() {

    const { token } = useAuth();

    const [dashboard, setDashboard] =
        useState<DashboardResponse | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const navigate = useNavigate();

    useEffect(() => {

        async function loadDashboard() {

            if (!token) {

                return;

            }

            try {

                setLoading(true);

                const data = await getDashboard(token);

                setDashboard(data);

            }
            catch (err) {

                console.error(
                    "Errore caricamento dashboard:",
                    err
                );

                setError(
                    "Non è stato possibile caricare la dashboard."
                );

            }
            finally {

                setLoading(false);

            }

        }

        loadDashboard();

    }, [token]);

    if (loading) {

        return <p>Caricamento...</p>;

    }

    if (error) {

        return <p>{error}</p>;

    }

    if (!dashboard) {

        return null;

    }

    return (

        <main className="dashboard-page">

            <DashboardHeader
                displayName={dashboard.displayName}
            />

            <button
                className="dashboard-explore-button"
                onClick={() => navigate("/explore")}
            >
                Esplora Adytum
            </button>

            <section className="dashboard-stats">

                <StatCard
                    label="La tua biblioteca"
                    value={dashboard.totalBooks}
                    description="Libri nella tua collezione"
                    onClick={() => navigate("/library")}
                />

                <StatCard
                    label="Disponibili"
                    value={dashboard.availableBooks}
                    description="Libri disponibili al prestito"
                    onClick={() => navigate("/library")}
                />

                <StatCard
                    label="Prestiti attivi"
                    value={dashboard.activeLoans}
                    description="Prestiti attualmente in corso"
                    onClick={() => navigate("/loans")}
                />

            </section>

            <RecentBooks
                books={dashboard.recentBooks}
            />

        </main>

    );

}

export default DashboardPage;