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

import {
    searchUsers,
    type UserSearchResult
} from "../../services/UserService";

import { getImageUrl }
    from "../../utils/imageUrl";

import "./ExploreResultsPage.css";


type SearchType =
    "books" |
    "users";


function ExploreResultsPage() {

    const { token } =
        useAuth();

    const navigate =
        useNavigate();

    const [params] =
        useSearchParams();


    const query =
        params.get("q") ?? "";

    const mode =
        params.get("mode") ?? "all";

    const type =
        (params.get("type") ?? "books") as SearchType;


    const [bookResults, setBookResults] =
        useState<(SearchBookResult | NearbyBook)[]>([]);

    const [userResults, setUserResults] =
        useState<UserSearchResult[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        async function loadResults() {

            if (!token || !query) {
                return;
            }

            try {

                setLoading(true);
                setError("");

                if (type === "users") {

                    const users =
                        await searchUsers(
                            query,
                            token
                        );

                    setUserResults(users);

                    setBookResults([]);

                    return;
                }


                const books =
                    mode === "nearby"
                        ? await searchNearbyBooks(
                            query,
                            token
                        )
                        : await searchBooks(
                            query,
                            token
                        );


                setBookResults(books);

                setUserResults([]);

            }
            catch (err) {

                console.error(
                    "Errore ricerca:",
                    err
                );

                setError(
                    "Non è stato possibile completare la ricerca."
                );

            }
            finally {

                setLoading(false);

            }

        }


        loadResults();

    }, [
        query,
        mode,
        type,
        token
    ]);


    const resultCount =
        type === "users"
            ? userResults.length
            : bookResults.length;


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


                {!loading && !error && (

                    <span>

                        {type === "users"
                            ? `${resultCount} ${resultCount === 1
                                ? "utente trovato"
                                : "utenti trovati"
                            }`
                            : `${resultCount} ${resultCount === 1
                                ? "libro trovato"
                                : "libri trovati"
                            }`
                        }

                    </span>

                )}

            </header>


            {loading ? (

                <p className="results-loading" 
                role="status" 
                aria-live="polite">

                    {type === "users"
                        ? "Sto cercando tra i lettori di Adytum..."
                        : "Sto cercando tra gli scaffali..."
                    }

                </p>

            ) : error ? (

                <p className="results-error"
                role="alert">
                    {error}
                </p>

            ) : type === "users" ? (

                /* RISULTATI UTENTI */

                <section className="user-results-grid">

                    {userResults.length === 0 ? (

                        <div className="results-empty">

                            <p>
                                Nessun utente trovato.
                            </p>

                        </div>

                    ) : (

                        userResults.map((user) => {

                            const profileImage =
                                user.profilePictureUrl
                                    ? getImageUrl(
                                        user.profilePictureUrl
                                    )
                                    : null;


                            return (

                                <article
                                    key={user.userId}
                                    className="user-result-card"
                                    role="link"
                                    tabIndex={0}
                                    aria-label={`Apri il profilo di ${user.displayName}`}
                                    onClick={() =>
                                        navigate(
                                            `/users/${user.userId}`
                                        )
                                    }
                                    onKeyDown={(event) => {

                                        if (
                                            event.key === "Enter" ||
                                            event.key === " "
                                        ) {
                                            event.preventDefault();

                                            navigate(
                                                `/users/${user.userId}`
                                            );
                                        }

                                    }}
                                >

                                    <div className="user-result-avatar">

                                        {profileImage ? (

                                            <img
                                                src={profileImage}
                                                alt={
                                                    `Profilo di ${user.displayName}`
                                                }
                                            />

                                        ) : (

                                            <div className="user-result-avatar-placeholder">
                                                ✦
                                            </div>

                                        )}

                                    </div>


                                    <div className="user-result-info">

                                        <h2>
                                            {user.displayName}
                                        </h2>

                                        <p className="user-result-username">
                                            @{user.username}
                                        </p>

                                        {(user.city || user.province) && (

                                            <p className="user-result-location">
                                                {user.city}

                                                {user.city && user.province
                                                    ? ` (${user.province})`
                                                    : user.province
                                                }
                                            </p>

                                        )}

                                        <p className="user-result-books">
                                            {user.availableBooksCount === 1
                                                ? "1 libro disponibile"
                                                : `${user.availableBooksCount} libri disponibili`
                                            }
                                        </p>

                                        <button
                                            type="button"
                                            className="user-result-profile-button"
                                            onClick={(event) => {
                                                event.stopPropagation();

                                                navigate(
                                                    `/users/${user.userId}`
                                                );
                                            }}
                                        >
                                            Vedi profilo
                                        </button>

                                    </div>
                                </article>
                            );

                        })

                    )}

                </section>

            ) : (

                /* RISULTATI LIBRI */

                <section className="results-grid">

                    {bookResults.length === 0 ? (

                        <div className="results-empty">

                            <p>
                                Nessun libro trovato.
                            </p>

                        </div>

                    ) : (

                        bookResults.map((book) => {

                            const cover =
                                getImageUrl(
                                    book.thumbnailImageUrl
                                    ?? book.coverImageUrl 
                                );

                            const nearby =
                                "distanceKm" in book;


                            return (

                                <article
                                    key={book.bookCopyId}
                                    className="result-card"
                                    role="link"
                                    tabIndex={0}
                                    aria-label={`Apri ${book.title} di ${book.author}`}
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

                                    <div className="result-cover">

                                        {cover ? (

                                            <img
                                                src={cover}
                                                alt={`Copertina di ${book.title}`}
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
                                            {book.ownerDisplayName}

                                            {book.city &&
                                                ` · ${book.city}`
                                            }
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

                                            {book.availableForLoan
                                                ? "Disponibile"
                                                : "Non disponibile"
                                            }

                                        </span>

                                    </div>

                                </article>

                            );

                        })

                    )}

                </section>

            )}

        </main>

    );
}


export default ExploreResultsPage;