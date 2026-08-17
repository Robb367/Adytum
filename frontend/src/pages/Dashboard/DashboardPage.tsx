import { useEffect, useState } from "react";

import { useAuth } from "../../contexts/AuthContext";

import { useNavigate } from "react-router-dom";

import {
    getDashboard,
    type DashboardResponse
} from "../../services/DashboardService";

import { getNearbyUsers, type NearbyUser } from "../../services/MapService";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import "./DashboardPage.css";
import StatCard from "../../components/dashboard/StatCard";
import RecentBooks from "../../components/dashboard/RecentBooks";
import UserMap from "../../components/map/UserMap";


function DashboardPage() {

    const { token } = useAuth();

    const [dashboard, setDashboard] =
        useState<DashboardResponse | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [nearbyUsers, setNearbyUsers] =
        useState<NearbyUser[]>([]);

    const navigate = useNavigate();

    useEffect(() => {

        async function loadDashboard() {

            if (!token) {
                return;
            }

            try {

                setLoading(true);
                setError("");

                const [
                    dashboardData,
                    nearbyUsersData
                ] = await Promise.all([
                    getDashboard(token),
                    getNearbyUsers(token)
                ]);

                setDashboard(
                    dashboardData
                );

                setNearbyUsers(
                    nearbyUsersData
                );

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

            <div className="dashboard-layout">

                <section className="dashboard-left">

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

                </section>

                <aside className="dashboard-map-panel">

                    <div className="dashboard-map-heading">

                        <p className="section-eyebrow">
                            Intorno a te
                        </p>

                        <h2>
                            La tua area di ricerca
                        </h2>

                        <p>
                            Stai cercando libri entro{" "}
                            {dashboard.searchRadiusKm} km da{" "}
                            {dashboard.city}
                            {dashboard.city && dashboard.province
                                ? ` (${dashboard.province})`
                                : ""}
                            .
                        </p>

                    </div>

                    {
                        dashboard.latitude !== 0 &&
                            dashboard.longitude !== 0
                            ? (
                                <UserMap
                                    latitude={dashboard.latitude}
                                    longitude={dashboard.longitude}
                                    searchRadiusKm={dashboard.searchRadiusKm}
                                    nearbyUsers={nearbyUsers}
                                    city={dashboard.city}
                                    province={dashboard.province}
                                />
                            )
                            : (
                                <div className="dashboard-map-empty">

                                    <p>
                                        Completa la tua località nel profilo
                                        per visualizzare la mappa.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/profile")
                                        }
                                    >
                                        Vai al profilo
                                    </button>

                                </div>
                            )
                    }

                </aside>

            </div>

        </main>

    );

}

export default DashboardPage;