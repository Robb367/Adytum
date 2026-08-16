import { useEffect, useState } from "react";

import { useAuth } from "../../contexts/AuthContext";

import { useNavigate } from "react-router-dom";

import { getImageUrl } from "../../utils/imageUrl";

import { getBookConditionLabel } from "../../utils/bookCondition";

import {
    getMyLibrary,
    type LibraryBook
} from "../../services/BookService";

import "./LibraryPage.css";

function LibraryPage() {

    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

    const { token } = useAuth();

    const [books, setBooks] =
        useState<LibraryBook[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        async function loadLibrary() {

            if (!token) {
                return;
            }

            try {

                setLoading(true);

                const data =
                    await getMyLibrary(token);

                setBooks(data);

            }
            catch (err) {

                console.error(
                    "Errore caricamento biblioteca:",
                    err
                );

                setError(
                    "Non è stato possibile caricare la biblioteca."
                );

            }
            finally {

                setLoading(false);

            }

        }

        loadLibrary();

    }, [token]);

    if (loading) {
        return <p>Caricamento...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const filteredBooks = books.filter((book) => {

        const search = searchTerm
            .trim()
            .toLowerCase();

        if (!search) {
            return true;
        }

        return (
            book.title
                .toLowerCase()
                .includes(search) ||

            book.author
                .toLowerCase()
                .includes(search)
        );

    });
    return (

        <main className="library-page">

            <header className="library-header">

                <div className="library-header-text">

                    <p className="library-eyebrow">
                        La tua collezione
                    </p>

                    <h1>
                        La tua biblioteca
                    </h1>

                    <p>
                        Custodisci, organizza e ritrova
                        le storie che hai scelto di conservare.
                    </p>

                </div>

                <button
                    type="button"
                    className="library-add-button"
                    onClick={() => navigate("/books/add")}
                >
                    + Aggiungi libro
                </button>

            </header>

            <div className="library-search">

                <input
                    type="text"
                    value={searchTerm}
                    placeholder="Cerca nella tua biblioteca..."
                    onChange={(event) =>
                        setSearchTerm(event.target.value)
                    }
                />

            </div>
            <section className="library-grid">

                {filteredBooks.length === 0 ? (

                    <div className="library-no-results">

                        <p>
                            {searchTerm.trim()
                                ? (
                                    <>
                                        Nessun risultato trovato per{" "}
                                        <span>{searchTerm}</span>.
                                    </>
                                )
                                : "La tua biblioteca è ancora vuota."
                            }
                        </p>

                    </div>

                ) : (

                    filteredBooks.map((book) => {

                        const coverUrl =
                            getImageUrl(book.coverImageUrl);

                        const conditionLabel =
                            getBookConditionLabel(book.condition);

                        return (

                            <article
                                className="library-card"
                                key={book.bookCopyId}
                                onClick={() =>
                                    navigate(`/books/${book.bookCopyId}`)
                                }
                            >

                                <div className="library-cover">

                                    {coverUrl ? (

                                        <img
                                            src={coverUrl}
                                            alt={`Copertina di ${book.title}`}
                                        />

                                    ) : (

                                        <div className="library-cover-placeholder">

                                            <span>✦</span>

                                            <p>
                                                Nessuna
                                                <br />
                                                copertina
                                            </p>

                                        </div>

                                    )}

                                </div>

                                <div className="library-card-body">

                                    <h2>
                                        {book.title}
                                    </h2>

                                    <p className="library-author">
                                        {book.author}
                                    </p>

                                    <div className="library-meta">

                                        <span>
                                            {conditionLabel}
                                        </span>

                                        <span
                                            className={
                                                book.availableForLoan
                                                    ? "availability available"
                                                    : "availability unavailable"
                                            }
                                        >
                                            {
                                                book.availableForLoan
                                                    ? "Disponibile"
                                                    : "Non disponibile"
                                            }
                                        </span>

                                    </div>

                                </div>

                            </article>

                        );

                    })

                )}

            </section>

        </main>

    );

}

export default LibraryPage;