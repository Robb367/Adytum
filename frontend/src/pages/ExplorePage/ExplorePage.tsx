import {
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import {
    searchBooks,
    type SearchBookResult
} from "../../services/BookService";

import "./ExplorePage.css";

type SearchMode = "all" | "nearby";

function ExplorePage() {

    const navigate = useNavigate();

    const { token } = useAuth();

    const [query, setQuery] = useState("");
    const [mode, setMode] = useState<SearchMode>("all");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<SearchBookResult[]>([]);

    useEffect(() => {

        const trimmedQuery = query.trim();

        if (!token || trimmedQuery.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const timeout = setTimeout(async () => {

            try {

                const data = await searchBooks(
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

        }, 300);

        return () => {
            clearTimeout(timeout);
        };

    }, [query, token]);
    function handleSearch() {

        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            return;
        }

        navigate(
            `/explore/results?q=${encodeURIComponent(trimmedQuery)}&mode=${mode}`
        );
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
                        Cerca tra i libri condivisi dai lettori di Adytum.
                    </p>

                    <div className="explore-search">

                        <input
                            type="text"
                            value={query}
                            placeholder="Cerca per titolo o autore..."
                            onChange={(event) =>
                                setQuery(event.target.value)
                            }
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
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

                    {showSuggestions && suggestions.length > 0 && (

                        <div className="explore-suggestions">

                            {suggestions.map((book) => (

                                <button
                                    type="button"
                                    key={book.bookCopyId}
                                    className="explore-suggestion"
                                    onClick={() => {
                                        setQuery(book.title);
                                        setShowSuggestions(false);
                                    }}
                                >

                                    <strong>
                                        {book.title}
                                    </strong>

                                    <span>
                                        {book.author}
                                    </span>

                                </button>

                            ))}

                        </div>

                    )}
                    <div className="explore-modes">

                        <button
                            type="button"
                            className={
                                mode === "all"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setMode("all")
                            }
                        >
                            Tutti i libri
                        </button>

                        <button
                            type="button"
                            className={
                                mode === "nearby"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setMode("nearby")
                            }
                        >
                            Vicino a me
                        </button>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default ExplorePage;