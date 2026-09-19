import {
    useEffect,
    useState
} from "react";

import { useAuth }
    from "../../contexts/AuthContext";

import {
    getReceivedLoans,
    getSentLoans,
    acceptLoan,
    rejectLoan,
    returnLoan,
    type ReceivedLoanRequest,
    type SentLoanRequest
} from "../../services/LoanService";

import {
    getLoanStatusLabel
} from "../../utils/loanStatus";

import "./LoansPage.css";

type LoanTab = "received" | "sent";

function LoansPage() {

    const { token } = useAuth();

    const [tab, setTab] =
        useState<LoanTab>("received");

    const [receivedLoans, setReceivedLoans] =
        useState<ReceivedLoanRequest[]>([]);

    const [sentLoans, setSentLoans] =
        useState<SentLoanRequest[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    async function loadLoans() {

        if (!token) {
            return;
        }

        try {

            setLoading(true);
            setError("");

            // Le richieste di prestito e inviate vengono caricate contemporaneamente per ottimizzare le performance (il tempo di attesa complessivo della pagina viene ridotto).
            const [
                received,
                sent
            ] = await Promise.all([
                getReceivedLoans(token),
                getSentLoans(token)
            ]);

            setReceivedLoans(received);
            setSentLoans(sent);

        }
        catch (err) {

            console.error(
                "Errore caricamento prestiti:",
                err
            );

            setError(
                "Non è stato possibile caricare i prestiti."
            );

        }
        finally {

            setLoading(false);

        }
    }

    useEffect(() => {
        loadLoans();
    }, [token]);

    async function handleAccept(
        loanId: number
    ) {

        if (!token) {
            return;
        }

        try {

            await acceptLoan(
                loanId,
                token
            );

            await loadLoans();

        }
        catch (err) {

            console.error(
                "Errore accettazione prestito:",
                err
            );

        }
    }

    async function handleReject(
        loanId: number
    ) {

        if (!token) {
            return;
        }

        try {

            await rejectLoan(
                loanId,
                token
            );

            await loadLoans();

        }
        catch (err) {

            console.error(
                "Errore rifiuto prestito:",
                err
            );

        }
    }

    async function handleReturn(
        loanId: number
    ) {

        if (!token) {
            return;
        }

        try {

            await returnLoan(
                loanId,
                token
            );

            await loadLoans();

        }
        catch (err) {

            console.error(
                "Errore restituzione prestito:",
                err
            );

        }
    }

    function formatDate(
        date: string | null
    ) {

        if (!date) {
            return "—";
        }

        return new Date(date)
            .toLocaleDateString("it-IT");
    }

    return (
        <main className="loans-page">

            <section className="loans-header">

                <p className="loans-eyebrow">
                    ADYTUM
                </p>

                <h1>
                    I tuoi prestiti
                </h1>

                <p>
                    Gestisci le richieste ricevute
                    e tieni sotto controllo quelle inviate.
                </p>

            </section>

            <div className="loans-tabs">

                <button
                    type="button"
                    className={
                        tab === "received"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setTab("received")
                    }
                >
                    Ricevuti
                </button>

                <button
                    type="button"
                    className={
                        tab === "sent"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setTab("sent")
                    }
                >
                    Inviati
                </button>

            </div>

            {error && (
                <p className="loans-error">
                    {error}
                </p>
            )}

            {loading ? (

                <p className="loans-loading">
                    Sto consultando il registro...
                </p>

            ) : tab === "received" ? (

                <section className="loans-list">

                    {receivedLoans.length === 0 ? (

                        <p className="loans-empty">
                            Nessuna richiesta ricevuta.
                        </p>

                    ) : (

                        receivedLoans.map((loan) => (

                            <article
                                className="loan-card"
                                key={loan.loanId}
                            >

                                <div className="loan-card-main">

                                    <h2>
                                        {loan.bookTitle}
                                    </h2>

                                    <p>
                                        Richiesto da{" "}
                                        <strong>
                                            {
                                                loan.borrowerDisplayName ||
                                                loan.borrowerUsername
                                            }
                                        </strong>
                                    </p>

                                </div>

                                <div className="loan-card-meta">

                                    <div>
                                        <span>
                                            Richiesta
                                        </span>

                                        <strong>
                                            {
                                                formatDate(
                                                    loan.requestDate
                                                )
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Restituzione
                                        </span>

                                        <strong>
                                            {
                                                formatDate(
                                                    loan.dueDate
                                                )
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Stato
                                        </span>

                                        <strong>
                                            {
                                                getLoanStatusLabel(
                                                    loan.status
                                                )
                                            }
                                        </strong>
                                    </div>

                                </div>

                                {loan.status === 0 && (

                                    <div className="loan-card-actions">

                                        <button
                                            type="button"
                                            className="loan-accept"
                                            onClick={() =>
                                                handleAccept(
                                                    loan.loanId
                                                )
                                            }
                                        >
                                            Accetta
                                        </button>

                                        <button
                                            type="button"
                                            className="loan-reject"
                                            onClick={() =>
                                                handleReject(
                                                    loan.loanId
                                                )
                                            }
                                        >
                                            Rifiuta
                                        </button>

                                    </div>

                                )}

                                {loan.status === 1 && (

                                    <div className="loan-card-actions">

                                        <button
                                            type="button"
                                            className="loan-return"
                                            onClick={() =>
                                                handleReturn(
                                                    loan.loanId
                                                )
                                            }
                                        >
                                            Segna come restituito
                                        </button>

                                    </div>

                                )}

                            </article>

                        ))

                    )}

                </section>

            ) : (

                <section className="loans-list">

                    {sentLoans.length === 0 ? (

                        <p className="loans-empty">
                            Nessuna richiesta inviata.
                        </p>

                    ) : (

                        sentLoans.map((loan) => (

                            <article
                                className="loan-card"
                                key={loan.loanId}
                            >

                                <div className="loan-card-main">

                                    <h2>
                                        {loan.bookTitle}
                                    </h2>

                                    <p>
                                        Proprietario{" "}
                                        <strong>
                                            {
                                                loan.lenderDisplayName ||
                                                loan.lenderUsername
                                            }
                                        </strong>
                                    </p>

                                </div>

                                <div className="loan-card-meta">

                                    <div>
                                        <span>
                                            Richiesta
                                        </span>

                                        <strong>
                                            {
                                                formatDate(
                                                    loan.requestDate
                                                )
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Restituzione
                                        </span>

                                        <strong>
                                            {
                                                formatDate(
                                                    loan.dueDate
                                                )
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Stato
                                        </span>

                                        <strong>
                                            {
                                                getLoanStatusLabel(
                                                    loan.status
                                                )
                                            }
                                        </strong>
                                    </div>

                                </div>

                            </article>

                        ))

                    )}

                </section>

            )}

        </main>
    );
}

export default LoansPage;