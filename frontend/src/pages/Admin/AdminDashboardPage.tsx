import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../../contexts/AuthContext";

import {
    getAdminDashboard,
    type AdminDashboardResponse
} from "../../services/AdminService";

import "./AdminDashboardPage.css";
import AdminBarChart from "../../pages/Admin/AdminBarChart";
import AdminActivityChart from "./AdminActivityChart";

function AdminDashboardPage() {

    const { token } =
        useAuth();

    const navigate =
        useNavigate();

    const [dashboard, setDashboard] =
        useState<AdminDashboardResponse | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        async function loadDashboard() {

            if (!token) {
                return;
            }

            try {

                setLoading(true);
                setError("");

                const data =
                    await getAdminDashboard(
                        token
                    );

                setDashboard(data);

            }
            catch (err) {

                console.error(
                    "Errore dashboard admin:",
                    err
                );

                setError(
                    "Non è stato possibile caricare la dashboard amministrativa."
                );

            }
            finally {

                setLoading(false);

            }

        }

        loadDashboard();

    }, [token]);


    if (loading) {

        return (
            <main className="admin-dashboard-page">

                <p className="admin-dashboard-status">
                    Caricamento...
                </p>

            </main>
        );

    }


    if (error) {

        return (
            <main className="admin-dashboard-page">

                <p className="admin-dashboard-status">
                    {error}
                </p>

            </main>
        );

    }


    if (!dashboard) {
        return null;
    }


    return (

        <main className="admin-dashboard-page">

            <div className="admin-dashboard-container">

                <header className="admin-dashboard-header">

                    <p className="section-eyebrow">
                        Amministrazione
                    </p>

                    <h1>
                        Osservatorio di Adytum
                    </h1>

                    <p>
                        Una panoramica sul patrimonio,
                        sugli utenti e sulle attività
                        della piattaforma.
                    </p>

                </header>


                <section className="admin-dashboard-stats">

                    <div className="admin-stat-card">

                        <span>
                            {dashboard.totalUsers}
                        </span>

                        <h2>
                            Utenti
                        </h2>

                        <p>
                            Profili registrati
                        </p>

                    </div>


                    <div className="admin-stat-card">

                        <span>
                            {dashboard.totalBooks}
                        </span>

                        <h2>
                            Opere
                        </h2>

                        <p>
                            Libri distinti catalogati
                        </p>

                    </div>


                    <div className="admin-stat-card">

                        <span>
                            {dashboard.totalBookCopies}
                        </span>

                        <h2>
                            Copie
                        </h2>

                        <p>
                            Volumi nelle biblioteche
                        </p>

                    </div>


                    <div className="admin-stat-card">

                        <span>
                            {dashboard.activeLoans}
                        </span>

                        <h2>
                            Prestiti attivi
                        </h2>

                        <p>
                            Scambi attualmente in corso
                        </p>

                    </div>


                    <div className="admin-stat-card">

                        <span>
                            {dashboard.completedLoans}
                        </span>

                        <h2>
                            Prestiti conclusi
                        </h2>

                        <p>
                            Scambi completati
                        </p>

                    </div>


                    <div className="admin-stat-card">

                        <span>
                            {dashboard.pendingRequests}
                        </span>

                        <h2>
                            Richieste pendenti
                        </h2>

                        <p>
                            In attesa di risposta
                        </p>

                    </div>

                </section>

                <section className="admin-dashboard-charts">

                    <AdminBarChart
                        title="Stato dei prestiti"
                        subtitle="Distribuzione corrente delle attività di prestito."
                        items={[
                            {
                                label: "Attivi",
                                value: dashboard.activeLoans
                            },
                            {
                                label: "Conclusi",
                                value: dashboard.completedLoans
                            },
                            {
                                label: "In attesa",
                                value: dashboard.pendingRequests
                            }
                        ]}
                    />

                    <AdminBarChart
                        title="Patrimonio catalogato"
                        subtitle="Confronto tra opere distinte e copie presenti nelle biblioteche."
                        items={[
                            {
                                label: "Opere",
                                value: dashboard.totalBooks
                            },
                            {
                                label: "Copie",
                                value: dashboard.totalBookCopies
                            }
                        ]}
                    />

                    <AdminActivityChart
                        data={dashboard.activityLast30Days ?? []}
                    />

                </section>

                <div className="admin-dashboard-columns">

                    <section className="admin-panel">

                        <div className="admin-panel-heading">

                            <p className="section-eyebrow">
                                Comunità
                            </p>

                            <h2>
                                Nuovi utenti
                            </h2>

                        </div>


                        <div className="admin-list">

                            {dashboard.recentUsers.length === 0 ? (

                                <p className="admin-empty">
                                    Nessun utente recente.
                                </p>

                            ) : (

                                dashboard.recentUsers.map(
                                    user => (

                                        <article
                                            key={user.id}
                                            className="admin-list-item admin-list-item-clickable"
                                            role="link"
                                            tabIndex={0}
                                            aria-label={`Apri il profilo di ${user.displayName}`}
                                            onClick={() =>
                                                navigate(
                                                    `/users/${user.id}`
                                                )
                                            }
                                            onKeyDown={(event) => {

                                                if (
                                                    event.key === "Enter" ||
                                                    event.key === " "
                                                ) {
                                                    event.preventDefault();

                                                    navigate(
                                                        `/users/${user.id}`
                                                    );
                                                }

                                            }}
                                        >

                                            <div className="admin-user-symbol">
                                                ✦
                                            </div>


                                            <div className="admin-list-main">

                                                <h3>
                                                    {user.displayName}
                                                </h3>

                                                <p>
                                                    @{user.username}
                                                </p>

                                            </div>


                                            <time>
                                                {
                                                    new Date(
                                                        user.registrationDate
                                                    ).toLocaleDateString(
                                                        "it-IT"
                                                    )
                                                }
                                            </time>

                                        </article>

                                    )
                                )

                            )}

                        </div>

                    </section>


                    <section className="admin-panel">

                        <div className="admin-panel-heading">

                            <p className="section-eyebrow">
                                Catalogo
                            </p>

                            <h2>
                                Ultimi libri aggiunti
                            </h2>

                        </div>


                        <div className="admin-list">

                            {dashboard.recentBooks.length === 0 ? (

                                <p className="admin-empty">
                                    Nessun libro recente.
                                </p>

                            ) : (

                                dashboard.recentBooks.map(
                                    book => (

                                        <article
                                            key={book.bookCopyId}
                                            className="admin-list-item admin-list-item-clickable"
                                            role="link"
                                            tabIndex={0}
                                            aria-label={`Apri ${book.title}`}
                                            onClick={() =>
                                                navigate(
                                                    `/books/${book.bookCopyId}`
                                                )
                                            }
                                            onKeyDown={(event) => {

                                                if (
                                                    event.key === "Enter" ||
                                                    event.key === " "
                                                ) {
                                                    event.preventDefault();

                                                    navigate(
                                                        `/books/${book.bookCopyId}`
                                                    );
                                                }

                                            }}
                                        >

                                            <div className="admin-book-symbol">
                                                ✦
                                            </div>


                                            <div className="admin-list-main">

                                                <h3>
                                                    {book.title}
                                                </h3>

                                                <p>
                                                    di proprietà di{" "}
                                                    {book.ownerDisplayName}
                                                </p>

                                            </div>


                                            <time>
                                                {
                                                    new Date(
                                                        book.addedAt
                                                    ).toLocaleDateString(
                                                        "it-IT"
                                                    )
                                                }
                                            </time>

                                        </article>

                                    )
                                )

                            )}

                        </div>

                    </section>

                </div>

            </div>

        </main>

    );

}


export default AdminDashboardPage;