import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useSearchParams
} from "react-router-dom";

import { useAuth }
    from "../../contexts/AuthContext";

import {
    searchBooks,
    searchNearbyBooks,
    type SearchBookResult,
    type NearbyBook
} from "../../services/BookService";

import { getImageUrl }
    from "../../utils/imageUrl";

import "./ExploreResultsPage.css";

function ExploreResultsPage() {

    const { token } = useAuth();

    const navigate = useNavigate();

    const [params] = useSearchParams();

    const query =
        params.get("q") ?? "";

    const mode =
        params.get("mode") ?? "all";

    const [results, setResults] =
        useState<(SearchBookResult | NearbyBook)[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        async function loadResults() {

            if (!token || !query) {
                return;
            }

            try {

                setLoading(true);

                const data =
                    mode === "nearby"
                        ? await searchNearbyBooks(
                            query,
                            token
                        )
                        : await searchBooks(
                            query,
                            token
                        );

                setResults(data);

            }
            catch (err) {

                console.error(
                    "Errore ricerca:",
                    err
                );

            }
            finally {

                setLoading(false);

            }

        }

        loadResults();

    }, [query, mode, token]);

    return (

        <main className="results-page">

            <header className="results-header">

                <button
                    onClick={() =>
                        navigate("/explore")
                    }
                >
                    ← Torna alla ricerca
                </button>

                <p>
                    RISULTATI DELLA RICERCA
                </p>

                <h1>
                    “{query}”
                </h1>

                {!loading && (
                    <span>
                        {results.length} libri trovati
                    </span>
                )}

            </header>

            {loading ? (

                <p className="results-loading">
                    Sto cercando tra gli scaffali...
                </p>

            ) : (

                <section className="results-grid">

                    {results.map((book) => {

                        const cover =
                            getImageUrl(
                                book.coverImageUrl
                            );

                        const nearby =
                            "distanceKm" in book;

                        return (

                            <article
                                key={book.bookCopyId}
                                className="result-card"
                                onClick={() =>
                                    navigate(
                                        `/books/${book.bookCopyId}`
                                    )
                                }
                            >

                                <div className="result-cover">

                                    {cover ? (

                                        <img
                                            src={cover}
                                            alt={book.title}
                                        />

                                    ) : (

                                        <div className="result-no-cover">
                                            ✦
                                        </div>

                                    )}

                                </div>

                                <div className="result-info">

                                    <h2>
                                        {book.title}
                                    </h2>

                                    <p>
                                        {book.author}
                                    </p>

                                    <small>
                                        {
                                            book.ownerDisplayName
                                        }
                                        {book.city &&
                                            ` · ${book.city}`}
                                    </small>

                                    {nearby && (

                                        <small>
                                            {book.distanceKm.toFixed(1)}
                                            {" km da te"}
                                        </small>

                                    )}

                                    <span
                                        className={
                                            book.availableForLoan
                                                ? "available"
                                                : "unavailable"
                                        }
                                    >
                                        {
                                            book.availableForLoan
                                                ? "Disponibile"
                                                : "Non disponibile"
                                        }
                                    </span>

                                </div>

                            </article>

                        );

                    })}

                </section>

            )}

        </main>

    );
}

export default ExploreResultsPage;