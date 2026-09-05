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
    searchBooks,
    type SearchBookResult
} from "../../services/BookService";

import "./ExplorePage.css";


type SearchMode =
    "all" |
    "nearby";

type SearchType =
    "books" |
    "users";


function ExplorePage() {

    const navigate =
        useNavigate();

    const { token } =
        useAuth();


    const [query, setQuery] =
        useState("");

    const [mode, setMode] =
        useState<SearchMode>("all");

    const [searchType, setSearchType] =
        useState<SearchType>("books");

    const [
        showSuggestions,
        setShowSuggestions
    ] = useState(false);

    const [
        suggestions,
        setSuggestions
    ] = useState<SearchBookResult[]>([]);


    useEffect(() => {

        const trimmedQuery =
            query.trim();


        /*
         * Per ora l'autocomplete esiste
         * solamente per i libri.
         */
        if (
            searchType !== "books" ||
            !token ||
            trimmedQuery.length < 2
        ) {

            setSuggestions([]);

            setShowSuggestions(false);

            return;
        }


        const timeout =
            setTimeout(
                async () => {

                    try {

                        const data =
                            await searchBooks(
                                trimmedQuery,
                                token
                            );

                        setSuggestions(
                            data.slice(0, 6)
                        );

                        setShowSuggestions(true);

                    }
                    catch (err) {

                        console.error(
                            "Errore caricamento suggerimenti:",
                            err
                        );

                        setSuggestions([]);

                        setShowSuggestions(false);

                    }

                },
                300
            );


        return () => {

            clearTimeout(
                timeout
            );

        };

    }, [
        query,
        token,
        searchType
    ]);


    function handleSearch() {

        const trimmedQuery =
            query.trim();

        if (!trimmedQuery) {
            return;
        }


        if (searchType === "users") {

            navigate(
                `/explore/results?q=${encodeURIComponent(trimmedQuery)}&type=users`
            );

            return;
        }


        navigate(
            `/explore/results?q=${encodeURIComponent(trimmedQuery)}&type=books&mode=${mode}`
        );

    }


    function handleSearchTypeChange(
        type: SearchType
    ) {

        setSearchType(type);

        setSuggestions([]);

        setShowSuggestions(false);

    }


    return (

        <main className="explore-page">

            <section className="explore-hero">

                <div className="explore-content">

                    <p className="explore-eyebrow">
                        Esplora Adytum
                    </p>


                    <h1>
                        Trova la tua prossima storia.
                    </h1>


                    <p className="explore-subtitle">

                        {searchType === "books"
                            ? "Cerca tra i libri condivisi dai lettori di Adytum."
                            : "Scopri i lettori e le biblioteche della comunità."
                        }

                    </p>


                    {/* LIBRI / UTENTI */}

                    <div className="explore-search-type">

                        <button
                            type="button"
                            aria-pressed={searchType === "books"}
                            className={
                                searchType === "books"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                handleSearchTypeChange(
                                    "books"
                                )
                            }
                        >
                            Libri
                        </button>


                        <button
                            type="button"
                            aria-pressed={searchType === "users"}
                            className={
                                searchType === "users"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                handleSearchTypeChange(
                                    "users"
                                )
                            }
                        >
                            Utenti
                        </button>

                    </div>


                    {/* SEARCH BAR */}

                    <div className="explore-search">

                        <input
                            type="text"
                            value={query}
                            placeholder={
                                searchType === "books"
                                    ? "Cerca per titolo o autore..."
                                    : "Cerca per nome o username..."
                            }
                            onChange={(event) =>
                                setQuery(
                                    event.target.value
                                )
                            }
                            onKeyDown={(event) => {

                                if (
                                    event.key === "Enter"
                                ) {

                                    handleSearch();

                                }

                            }}
                        />


                        <button
                            type="button"
                            onClick={handleSearch}
                        >
                            Cerca
                        </button>

                    </div>


                    {/* AUTOCOMPLETE LIBRI */}

                    {
                        searchType === "books" &&
                        showSuggestions &&
                        suggestions.length > 0 &&
                        (

                            <div className="explore-suggestions">

                                {suggestions.map(
                                    (book) => (

                                        <button
                                            type="button"
                                            key={
                                                book.bookCopyId
                                            }
                                            className="explore-suggestion"
                                            onClick={() => {

                                                setQuery(
                                                    book.title
                                                );

                                                setShowSuggestions(
                                                    false
                                                );

                                            }}
                                        >

                                            <strong>
                                                {book.title}
                                            </strong>

                                            <span>
                                                {book.author}
                                            </span>

                                        </button>

                                    )
                                )}

                            </div>

                        )
                    }


                    {/* TUTTI / VICINO A ME */}

                    {
                        searchType === "books" && (

                            <div className="explore-modes">

                                <div className="explore-modes-buttons">

                                    <button
                                        type="button"
                                        aria-pressed={mode === "all"}
                                        className={
                                            mode === "all"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setMode(
                                                "all"
                                            )
                                        }
                                    >
                                        Tutti i libri
                                    </button>


                                    <button
                                        type="button"
                                        aria-pressed={mode === "nearby"}
                                        className={
                                            mode === "nearby"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setMode(
                                                "nearby"
                                            )
                                        }
                                    >
                                        Vicino a me
                                    </button>

                                </div>

                            </div>

                        )
                    }

                </div>

            </section>

        </main>

    );
}


export default ExplorePage;