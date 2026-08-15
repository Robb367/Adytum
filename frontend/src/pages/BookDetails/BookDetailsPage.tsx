import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import {
    getBookDetails,
    toggleBookAvailability,
    type BookDetails
} from "../../services/BookService";

import { getImageUrl } from "../../utils/imageUrl";

import { getBookConditionLabel }
    from "../../utils/bookCondition";

import "./BookDetailsPage.css";

import PrimaryButton from "../../components/common/PrimaryButton";
import SecondaryButton from "../../components/common/SecondaryButton";

import { requestLoan } from "../../services/LoanService";


function BookDetailsPage() {

    const [requestingLoan, setRequestingLoan] =
        useState(false);

    const [dueDate, setDueDate] = useState("");
    const [loanMessage, setLoanMessage] =
        useState("");

    const { bookCopyId } = useParams();

    const navigate = useNavigate();

    const { token } = useAuth();

    const [book, setBook] =
        useState<BookDetails | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    async function handleRequestLoan() {

        if (!token || !book) {
            return;
        }

        if (!dueDate) {
            setLoanMessage(
                "Seleziona una data prevista di restituzione."
            );
            return;
        }

        try {

            setRequestingLoan(true);
            setLoanMessage("");

            const response = await requestLoan(
                {
                    bookCopyId: book.bookCopyId,
                    dueDate: `${dueDate}T00:00:00`
                },
                token
            );

            setLoanMessage(response.message);

        }
        catch (err) {

            console.error(
                "Errore richiesta prestito:",
                err
            );

            setLoanMessage(
                "Non è stato possibile inviare la richiesta."
            );

        }
        finally {

            setRequestingLoan(false);

        }
    }

    async function handleToggleAvailability() {

        if (!token || !book) {
            return;
        }

        try {

            const availableForLoan =
                await toggleBookAvailability(
                    book.bookCopyId,
                    token
                );

            setBook({
                ...book,
                availableForLoan
            });

        }
        catch (err) {

            console.error(
                "Errore modifica disponibilità:",
                err
            );

            setError(
                "Non è stato possibile modificare la disponibilità."
            );

        }
    }
    useEffect(() => {

        async function loadBook() {

            if (!token || !bookCopyId) {
                return;
            }

            try {

                setLoading(true);

                const data =
                    await getBookDetails(
                        Number(bookCopyId),
                        token
                    );

                setBook(data);

            }
            catch (err) {

                console.error(
                    "Errore caricamento libro:",
                    err
                );

                setError(
                    "Non è stato possibile caricare il libro."
                );

            }
            finally {

                setLoading(false);

            }

        }

        loadBook();

    }, [bookCopyId, token]);

    if (loading) {
        return <p>Caricamento...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!book) {
        return null;
    }

    const coverUrl =
        getImageUrl(book.coverImageUrl);

    const condition =
        getBookConditionLabel(book.condition);

    return (

        <main className="book-details-page">

            <button
                className="book-details-back"
                onClick={() => navigate(-1)}
            >
                ← Torna indietro
            </button>

            <section className="book-details-layout">

                <div className="book-details-cover">

                    {coverUrl ? (

                        <img
                            src={coverUrl}
                            alt={`Copertina di ${book.title}`}
                        />

                    ) : (

                        <div className="book-details-placeholder">

                            <span>✦</span>

                            <p>
                                Nessuna copertina
                            </p>

                        </div>

                    )}

                </div>

                <div className="book-details-content">

                    <p className="book-details-eyebrow">
                        Scheda del libro
                    </p>

                    <h1>
                        {book.title}
                    </h1>

                    <p className="book-details-author">
                        {book.author}
                    </p>

                    <div className="book-details-meta">

                        <span>
                            {condition}
                        </span>

                        <span>
                            {
                                book.availableForLoan
                                    ? "Disponibile al prestito"
                                    : "Non disponibile"
                            }
                        </span>

                    </div>

                    <div className="book-details-info">

                        <p>
                            <strong>ISBN</strong>
                            {book.isbn}
                        </p>

                        <p>
                            <strong>Editore</strong>
                            {book.publisher || "Non disponibile"}
                        </p>

                        <p>
                            <strong>Anno</strong>
                            {
                                book.publicationYear || "Non disponibile"
                            }
                        </p>

                        <p>
                            <strong>Genere</strong>
                            {book.genre || "Non disponibile"}
                        </p>

                        <p>
                            <strong>Lingua</strong>
                            {book.language || "Non disponibile"}
                        </p>

                    </div>

                    {book.description && (

                        <div className="book-details-description">

                            <h2>
                                Descrizione
                            </h2>

                            <p>
                                {book.description}
                            </p>

                        </div>

                    )}

                    <div className="book-details-owner">

                        <p>
                            <strong>Proprietario</strong>
                            {book.ownerDisplayName}
                        </p>

                        <p>
                            <strong>Località</strong>
                            {book.city}
                            {
                                book.province
                                    ? ` (${book.province})`
                                    : ""
                            }
                        </p>

                        <p>
                            <strong>Distanza</strong>
                            {book.distanceKm} km
                        </p>

                    </div>

                    <div className="book-details-actions">

                        {book.isOwnedByCurrentUser ? (

                            <>

                                <p className="book-owner-notice">
                                    ✦ Questo libro appartiene alla tua biblioteca
                                </p>

                                <div className="book-action-buttons">

                                    <PrimaryButton
                                        text="Modifica copia"
                                        onClick={() =>
                                            navigate(`/books/${book.bookCopyId}/edit`)
                                        }
                                    />

                                    <SecondaryButton
                                        text={
                                            book.availableForLoan
                                                ? "Rendi non disponibile"
                                                : "Rendi disponibile"
                                        }

                                        onClick={handleToggleAvailability}
                                    />

                                </div>

                            </>

                        ) : (

                            <>

                                <p className="book-owner-notice">
                                    ✦ Questo libro appartiene a {book.ownerDisplayName}
                                </p>

                                <div className="book-action-buttons">

                                    <div className="loan-request-row">

                                        <div className="loan-date-field">

                                            <label htmlFor="dueDate">
                                                Data prevista di restituzione
                                            </label>

                                            <input
                                                id="dueDate"
                                                type="date"
                                                value={dueDate}
                                                min={new Date().toISOString().split("T")[0]}
                                                onChange={(event) =>
                                                    setDueDate(event.target.value)
                                                }
                                            />

                                        </div>

                                        <div className="loan-request-button">
                                            <PrimaryButton
                                                text={
                                                    requestingLoan
                                                        ? "Invio..."
                                                        : "Richiedi prestito"
                                                }
                                                disabled={requestingLoan}
                                                onClick={handleRequestLoan}
                                            />
                                        </div>

                                    </div>
                                    {loanMessage && (
                                        <p className="loan-message">
                                            {loanMessage}
                                        </p>
                                    )}
                                </div>

                                {!book.availableForLoan && (

                                    <p className="book-unavailable-message">
                                        Questo libro non è attualmente disponibile al prestito.
                                    </p>

                                )}

                            </>

                        )}

                    </div>

                </div>

            

        </section>

        </main >

    );
}

export default BookDetailsPage;