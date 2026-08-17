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
    updateBookCover,
    type BookDetails
} from "../../services/BookService";

import PrimaryButton
    from "../../components/common/PrimaryButton";

import SecondaryButton
    from "../../components/common/SecondaryButton";

import { getImageUrl }
    from "../../utils/imageUrl";

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


    const [customTitle, setCustomTitle] =
        useState("");

    const [customAuthor, setCustomAuthor] =
        useState("");

    const [customPublisher, setCustomPublisher] =
        useState("");

    const [
        customPublicationYear,
        setCustomPublicationYear
    ] = useState("");

    const [customGenre, setCustomGenre] =
        useState("");

    const [customPages, setCustomPages] =
        useState("");

    const [customDescription, setCustomDescription] =
        useState("");


    const [coverFile, setCoverFile] =
        useState<File | null>(null);

    const [coverUrl, setCoverUrl] =
        useState("");

    const [coverPreview, setCoverPreview] =
        useState<string | null>(null);


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


                setCustomTitle(
                    data.title ?? ""
                );

                setCustomAuthor(
                    data.author ?? ""
                );

                setCustomPublisher(
                    data.publisher ?? ""
                );

                setCustomPublicationYear(
                    data.publicationYear?.toString() ?? ""
                );

                setCustomGenre(
                    data.genre ?? ""
                );

                setCustomPages(
                    data.pages?.toString() ?? ""
                );

                setCustomDescription(
                    data.description ?? ""
                );


                setCondition(
                    data.condition
                );

                setAvailableForLoan(
                    data.availableForLoan
                );

                setPersonalNotes(
                    data.personalNotes ?? ""
                );


                setCoverUrl(
                    data.coverImageUrl ?? ""
                );

                setCoverPreview(
                    data.coverImageUrl
                        ? getImageUrl(data.coverImageUrl)
                        : null
                );

            }
            catch (err) {

                console.error(
                    "Errore caricamento copia:",
                    err
                );

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


    function handleCoverFileChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }


        setCoverFile(file);


        const previewUrl =
            URL.createObjectURL(file);

        setCoverPreview(
            previewUrl
        );

    }


    function handleCoverUrlChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {

        const value =
            event.target.value;

        setCoverUrl(
            value
        );

        setCoverFile(
            null
        );

        setCoverPreview(
            value || null
        );

    }


    async function handleSave() {

        if (!token || !bookCopyId) {
            return;
        }

        try {

            setSaving(true);

            setError("");


            const request = {

                customTitle:
                    customTitle.trim() || null,

                customAuthor:
                    customAuthor.trim() || null,

                customPublisher:
                    customPublisher.trim() || null,

                customPublicationYear:
                    customPublicationYear
                        ? Number(customPublicationYear)
                        : null,

                customGenre:
                    customGenre.trim() || null,

                customPages:
                    customPages
                        ? Number(customPages)
                        : null,

                customDescription:
                    customDescription.trim() || null,

                condition,

                availableForLoan,

                personalNotes:
                    personalNotes.trim() || null

            };


            await updateBookCopy(
                Number(bookCopyId),
                request,
                token
            );

            const coverHasChanged =
                coverFile !== null ||
                (
                    coverUrl.trim() !== "" &&
                    coverUrl.trim() !==
                    (book?.coverImageUrl ?? "")
                );

            if (coverHasChanged) {

                await updateBookCover(
                    Number(bookCopyId),
                    token,
                    coverFile,
                    coverUrl
                );

            }

            navigate(
                `/books/${bookCopyId}`
            );

        }
        catch (err) {

            console.error(
                "Errore salvataggio copia:",
                err
            );

            setError(
                "Non è stato possibile salvare le modifiche."
            );

        }
        finally {

            setSaving(false);

        }

    }


    if (loading) {

        return (
            <p>
                Caricamento...
            </p>
        );

    }


    if (error && !book) {

        return (
            <p>
                {error}
            </p>
        );

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


            <div className="edit-book-layout">


                {/* COPERTINA */}

                <aside className="edit-book-cover-panel">

                    <div className="edit-book-cover-preview">

                        {coverPreview ? (

                            <img
                                src={coverPreview}
                                alt={
                                    `Copertina di ${customTitle || book.title
                                    }`
                                }
                            />

                        ) : (

                            <div className="edit-book-cover-placeholder">

                                <span>
                                    ✦
                                </span>

                                <p>
                                    Nessuna copertina
                                </p>

                            </div>

                        )}

                    </div>


                    <label className="edit-book-cover-upload">

                        Carica copertina

                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            onChange={
                                handleCoverFileChange
                            }
                        />

                    </label>


                    {coverFile && (

                        <p className="edit-book-cover-file-name">
                            {coverFile.name}
                        </p>

                    )}


                    <div className="edit-book-cover-url">

                        <label htmlFor="coverUrl">
                            Oppure URL copertina
                        </label>

                        <input
                            id="coverUrl"
                            type="url"
                            value={coverUrl}
                            onChange={
                                handleCoverUrlChange
                            }
                            placeholder="https://..."
                        />

                    </div>

                </aside>


                {/* DATI DEL LIBRO */}

                <section className="edit-book-main">


                    <div className="edit-book-fields">


                        <div className="edit-book-field">

                            <label htmlFor="editTitle">
                                Titolo
                            </label>

                            <input
                                id="editTitle"
                                type="text"
                                value={customTitle}
                                onChange={(event) =>
                                    setCustomTitle(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="edit-book-field">

                            <label htmlFor="editAuthor">
                                Autore
                            </label>

                            <input
                                id="editAuthor"
                                type="text"
                                value={customAuthor}
                                onChange={(event) =>
                                    setCustomAuthor(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="edit-book-field">

                            <label htmlFor="editPublisher">
                                Editore
                            </label>

                            <input
                                id="editPublisher"
                                type="text"
                                value={customPublisher}
                                onChange={(event) =>
                                    setCustomPublisher(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="edit-book-row">


                            <div className="edit-book-field">

                                <label htmlFor="editPublicationYear">
                                    Anno di pubblicazione
                                </label>

                                <input
                                    id="editPublicationYear"
                                    type="number"
                                    min="0"
                                    value={
                                        customPublicationYear
                                    }
                                    onChange={(event) =>
                                        setCustomPublicationYear(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="edit-book-field">

                                <label htmlFor="editPages">
                                    Pagine
                                </label>

                                <input
                                    id="editPages"
                                    type="number"
                                    min="1"
                                    value={
                                        customPages
                                    }
                                    onChange={(event) =>
                                        setCustomPages(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                        </div>


                        <div className="edit-book-field">

                            <label htmlFor="editGenre">
                                Genere
                            </label>

                            <input
                                id="editGenre"
                                type="text"
                                value={customGenre}
                                onChange={(event) =>
                                    setCustomGenre(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="edit-book-field">

                            <label htmlFor="editDescription">
                                Descrizione
                            </label>

                            <textarea
                                id="editDescription"
                                value={customDescription}
                                onChange={(event) =>
                                    setCustomDescription(
                                        event.target.value
                                    )
                                }
                                rows={4}
                            />

                        </div>


                    </div>


                    {/* DATI DELLA COPIA */}

                    <div className="edit-book-form">


                        <label htmlFor="editCondition">

                            Condizione

                            <select
                                id="editCondition"
                                value={condition}
                                onChange={(event) =>
                                    setCondition(
                                        Number(
                                            event.target.value
                                        )
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
                                checked={
                                    availableForLoan
                                }
                                onChange={(event) =>
                                    setAvailableForLoan(
                                        event.target.checked
                                    )
                                }
                            />

                            Disponibile al prestito

                        </label>


                        <label htmlFor="editPersonalNotes">

                            Note personali

                            <textarea
                                id="editPersonalNotes"
                                value={personalNotes}
                                onChange={(event) =>
                                    setPersonalNotes(
                                        event.target.value
                                    )
                                }
                                rows={4}
                            />

                        </label>


                    </div>


                    {error && (

                        <p className="edit-book-error">
                            {error}
                        </p>

                    )}


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
                                navigate(
                                    `/books/${bookCopyId}`
                                )
                            }
                        />

                    </div>


                </section>


            </div>

        </main>

    );

}

export default EditBookCopyPage;