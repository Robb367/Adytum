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
    updateBookCopy,
    type BookDetails
} from "../../services/BookService";

import PrimaryButton
    from "../../components/common/PrimaryButton";

import SecondaryButton
    from "../../components/common/SecondaryButton";

import "./EditBookCopyPage.css";

function EditBookCopyPage() {

    const { bookCopyId } = useParams();

    const navigate = useNavigate();

    const { token } = useAuth();

    const [book, setBook] =
        useState<BookDetails | null>(null);

    const [condition, setCondition] =
        useState(0);

    const [availableForLoan, setAvailableForLoan] =
        useState(true);

    const [personalNotes, setPersonalNotes] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {

        async function loadBook() {

            if (!token || !bookCopyId) {
                return;
            }

            try {

                const data =
                    await getBookDetails(
                        Number(bookCopyId),
                        token
                    );

                setBook(data);

                setCondition(data.condition);

                setAvailableForLoan(
                    data.availableForLoan
                );

                setPersonalNotes(
                    data.personalNotes ?? ""
                );

            }
            catch (err) {

                console.error(err);

                setError(
                    "Non è stato possibile caricare la copia."
                );

            }
            finally {

                setLoading(false);

            }

        }

        loadBook();

    }, [bookCopyId, token]);

    async function handleSave() {

        if (!token || !bookCopyId) {
            return;
        }

        try {

            setSaving(true);

            await updateBookCopy(
                Number(bookCopyId),
                {
                    condition,
                    availableForLoan,
                    personalNotes
                },
                token
            );

            navigate(`/books/${bookCopyId}`);

        }
        catch (err) {

            console.error(err);

            setError(
                "Non è stato possibile salvare le modifiche."
            );

        }
        finally {

            setSaving(false);

        }

    }

    if (loading) {
        return <p>Caricamento...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!book) {
        return null;
    }

    return (

        <main className="edit-book-page">

            <p className="edit-book-eyebrow">
                La tua biblioteca
            </p>

            <h1>
                Modifica copia
            </h1>

            <p className="edit-book-title">
                {book.title}
            </p>

            <div className="edit-book-form">

                <label>

                    Condizione

                    <select
                        value={condition}
                        onChange={(event) =>
                            setCondition(
                                Number(event.target.value)
                            )
                        }
                    >
                        <option value={0}>
                            Eccellente
                        </option>

                        <option value={1}>
                            Buono
                        </option>

                        <option value={2}>
                            Discreto
                        </option>

                        <option value={3}>
                            Usurato
                        </option>

                        <option value={4}>
                            Danneggiato
                        </option>

                    </select>

                </label>

                <label className="edit-checkbox">

                    <input
                        type="checkbox"
                        checked={availableForLoan}
                        onChange={(event) =>
                            setAvailableForLoan(
                                event.target.checked
                            )
                        }
                    />

                    Disponibile al prestito

                </label>

                <label>

                    Note personali

                    <textarea
                        value={personalNotes}
                        onChange={(event) =>
                            setPersonalNotes(
                                event.target.value
                            )
                        }
                        rows={6}
                    />

                </label>

                <div className="edit-book-actions">

                    <PrimaryButton
                        text={
                            saving
                                ? "Salvataggio..."
                                : "Salva modifiche"
                        }
                        disabled={saving}
                        onClick={handleSave}
                    />

                    <SecondaryButton
                        text="Annulla"
                        onClick={() =>
                            navigate(`/books/${bookCopyId}`)
                        }
                    />

                </div>

            </div>

        </main>

    );

}

export default EditBookCopyPage;