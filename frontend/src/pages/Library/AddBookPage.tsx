import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../../contexts/AuthContext";

import {
    addBookToLibrary,
    lookupBookByIsbn
} from "../../services/BookService";

import "./AddBookPage.css";

function AddBookPage() {

    const { token } = useAuth();
    const navigate = useNavigate();

    const [isbn, setIsbn] = useState("");

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [publisher, setPublisher] = useState("");
    const [publicationYear, setPublicationYear] =
        useState<number | null>(null);

    const [language, setLanguage] = useState("");
    const [translator, setTranslator] = useState("");
    const [genre, setGenre] = useState("");

    const [pages, setPages] = useState<number | null>(null);

    const [description, setDescription] =
        useState("");

    const [coverImageUrl, setCoverImageUrl] =
        useState("");

    const [coverImage, setCoverImage] =
        useState<File | null>(null);

    const [condition, setCondition] =
        useState(1);

    const [availableForLoan, setAvailableForLoan] =
        useState(true);

    const [personalNotes, setPersonalNotes] =
        useState("");

    const [lookupLoading, setLookupLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [lookupMessage, setLookupMessage] =
        useState("");

    const [error, setError] =
        useState("");

    // Viene tentata la ricerca del libro su OpenLibrary tramite ISBN.
    // Se il libro viene trovato, i campi del modulo vengono automaticamente compilati con i dati recuperati.
    // Se il libro non viene trovato, l'utente può comunque inserire manualmente i dati.
    async function handleLookup() {

        if (!token || !isbn.trim()) {
            return;
        }

        try {

            setLookupLoading(true);
            setLookupMessage("");
            setError("");

            const book =
                await lookupBookByIsbn(
                    isbn.trim(),
                    token
                );

            if (!book) {

                setLookupMessage(
                    "Libro non trovato su OpenLibrary. Puoi inserirlo manualmente."
                );

                return;
            }

            setTitle(book.title ?? "");
            setAuthor(book.author ?? "");
            setPublisher(book.publisher ?? "");

            setPublicationYear(
                book.publicationYear ?? 0
            );

            setLanguage(
                book.language ?? ""
            );

            setPages(
                book.pages ?? 0
            );

            setDescription(
                book.description ?? ""
            );

            setCoverImageUrl(
                book.coverImageUrl ?? ""
            );

            setLookupMessage(
                "Libro trovato. Puoi controllare e completare i dati."
            );

        }
        catch (err) {

            console.error(
                "Errore lookup ISBN:",
                err
            );

            setError(
                "Non è stato possibile cercare il libro."
            );

        }
        finally {

            setLookupLoading(false);

        }

    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();

        if (!token) {
            return;
        }

        try {

            setSaving(true);
            setError("");
            // Invia i metadati del libro al backend sia bibliografici che relativi alla copia personale, inclusa l'eventuale immagine di copertina.
            await addBookToLibrary(
                {
                    isbn,
                    title,
                    author,
                    publisher,
                    publicationYear,
                    language,
                    translator,
                    genre,
                    pages,
                    description,
                    coverImageUrl,
                    condition,
                    availableForLoan,
                    personalNotes,
                    coverImage
                },
                token
            );

            navigate("/library");

        }
        catch (err) {

            console.error(
                "Errore aggiunta libro:",
                err
            );

            if (err instanceof Error) {
                setError(err.message);
            }
            else {
                setError(
                    "Non è stato possibile aggiungere il libro."
                );
            }

        }
        finally {

            setSaving(false);

        }

    }

    return (
        <main className="add-book-page">

            <header className="add-book-header">

                <button
                    type="button"
                    onClick={() =>
                        navigate("/library")
                    }
                >
                    ← Torna alla biblioteca
                </button>

                <p>
                    LA TUA COLLEZIONE
                </p>

                <h1>
                    Aggiungi un libro
                </h1>

                <span>
                    Cerca tramite ISBN oppure inserisci
                    manualmente i dati del volume.
                </span>

            </header>

            <section className="add-book-card">

                <div className="isbn-search">

                    <label htmlFor="isbn">
                        ISBN
                    </label>

                    <div>

                        <input
                            id="isbn"
                            type="text"
                            value={isbn}
                            placeholder="978..."
                            onChange={(event) =>
                                setIsbn(
                                    event.target.value
                                )
                            }
                            onKeyDown={(event) => {

                                if (event.key === "Enter") {

                                    event.preventDefault();

                                    handleLookup();

                                }

                            }}
                        />

                        <button
                            type="button"
                            disabled={lookupLoading}
                            onClick={handleLookup}
                        >
                            {
                                lookupLoading
                                    ? "Cerco..."
                                    : "Cerca"
                            }
                        </button>

                    </div>

                </div>

                {lookupMessage && (
                    <p className="lookup-message">
                        {lookupMessage}
                    </p>
                )}

                <form
                    className="add-book-form"
                    onSubmit={handleSubmit}
                >

                    <div className="add-book-form-grid">

                        <label>
                            Titolo

                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(event) =>
                                    setTitle(
                                        event.target.value
                                    )
                                }
                            />
                        </label>

                        <label>
                            Autore

                            <input
                                type="text"
                                required
                                value={author}
                                onChange={(event) =>
                                    setAuthor(
                                        event.target.value
                                    )
                                }
                            />
                        </label>

                        <label>
                            Editore

                            <input
                                type="text"
                                value={publisher}
                                onChange={(event) =>
                                    setPublisher(
                                        event.target.value
                                    )
                                }
                            />
                        </label>

                        <label>
                            Anno di pubblicazione

                            <input
                                type="number"
                                min="0"
                                value={publicationYear ?? ""}
                                onChange={(event) =>
                                    setPublicationYear(
                                        event.target.value
                                            ? Number(event.target.value)
                                            : null
                                    )
                                }
                            />
                        </label>

                        <label>
                            Lingua

                            <input
                                type="text"
                                value={language}
                                onChange={(event) =>
                                    setLanguage(
                                        event.target.value
                                    )
                                }
                            />
                        </label>

                        <label>
                            Traduttore

                            <input
                                type="text"
                                value={translator}
                                onChange={(event) =>
                                    setTranslator(
                                        event.target.value
                                    )
                                }
                            />
                        </label>

                        <label>
                            Genere

                            <input
                                type="text"
                                value={genre}
                                onChange={(event) =>
                                    setGenre(
                                        event.target.value
                                    )
                                }
                            />
                        </label>

                        <label>
                            Pagine

                            <input
                                type="number"
                                min="0"
                                value={
                                    pages ?? ""
                                }
                                onChange={(event) =>
                                    setPages(
                                        event.target.value
                                            ? Number(event.target.value)
                                            : null
                                    )
                                }
                            />
                        </label>

                    </div>

                    <label className="add-book-description">
                        Descrizione

                        <textarea
                            rows={5}
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                        />
                    </label>

                    <div className="add-book-copy-section">

                        <h2>
                            La tua copia
                        </h2>

                        <div className="add-book-form-grid">

                            <label>
                                Condizione

                                <select
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

                            <label>
                                Copertina personalizzata

                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp"
                                    onChange={(event) =>
                                        setCoverImage(
                                            event.target.files?.[0]
                                            ?? null
                                        )
                                    }
                                />
                            </label>

                        </div>

                        <label className="add-book-checkbox">

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

                        <label className="add-book-description">
                            Note personali

                            <textarea
                                rows={4}
                                value={personalNotes}
                                onChange={(event) =>
                                    setPersonalNotes(
                                        event.target.value
                                    )
                                }
                            />
                        </label>

                    </div>

                    {error && (
                        <p className="add-book-error">
                            {error}
                        </p>
                    )}

                    <div className="add-book-actions">

                        <button
                            type="button"
                            className="add-book-cancel"
                            onClick={() =>
                                navigate("/library")
                            }
                        >
                            Annulla
                        </button>

                        <button
                            type="submit"
                            className="add-book-submit"
                            disabled={saving}
                        >
                            {
                                saving
                                    ? "Aggiungo..."
                                    : "Aggiungi alla biblioteca"
                            }
                        </button>

                    </div>

                </form>

            </section>

        </main>
    );
}

export default AddBookPage;