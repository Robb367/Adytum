import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import { useAuth }
    from "../../contexts/AuthContext";

import {
    getAvailableBooksByUser
} from "../../services/UserService";

import type {
    SearchBookResult
} from "../../services/BookService";

import { getImageUrl }
    from "../../utils/imageUrl";

import "./PublicUserBookPage.css";


function PublicUserBookPage() {

    const { userId } =
        useParams();

    const { token } =
        useAuth();

    const navigate =
        useNavigate();


    const [books, setBooks] =
        useState<SearchBookResult[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        async function loadBooks() {

            if (!token || !userId) {
                return;
            }

            try {

                setLoading(true);

                const data =
                    await getAvailableBooksByUser(
                        Number(userId),
                        token
                    );

                setBooks(data);

            }
            catch (err) {

                console.error(
                    "Errore caricamento libri utente:",
                    err
                );

                setError(
                    "Non è stato possibile caricare i libri disponibili."
                );

            }
            finally {

                setLoading(false);

            }

        }

        loadBooks();

    }, [token, userId]);


    if (loading) {
        return <p>Caricamento...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }


    const ownerName =
        books.length > 0
            ? books[0].ownerDisplayName
            : "utente";


    return (

        <main className="public-user-books-page">

            <button
                className="public-user-books-back"
                onClick={() => navigate(-1)}
            >
                ← Torna al profilo
            </button>


            <div className="public-user-books-heading">

                <p className="section-eyebrow">
                    Biblioteca condivisa
                </p>

                <h1>
                    Libri disponibili di {ownerName}
                </h1>

            </div>


            {books.length === 0 ? (

                <div className="public-user-books-empty">

                    <p>
                        Questo utente non ha attualmente
                        libri disponibili al prestito.
                    </p>

                </div>

            ) : (

                <div className="public-user-books-grid">

                    {books.map((book) => {

                        const cover =
                            getImageUrl(
                                book.coverImageUrl
                            );

                        return (

                            <article
                                key={book.bookCopyId}
                                className="public-user-book-card"
                                onClick={() =>
                                    navigate(
                                        `/books/${book.bookCopyId}`
                                    )
                                }
                            >

                                <div className="public-user-book-cover">

                                    {cover ? (

                                        <img
                                            src={cover}
                                            alt={`Copertina di ${book.title}`}
                                        />

                                    ) : (

                                        <div className="public-user-book-placeholder">
                                            ✦
                                        </div>

                                    )}

                                </div>


                                <div className="public-user-book-info">

                                    <h2>
                                        {book.title}
                                    </h2>

                                    <p>
                                        {book.author}
                                    </p>

                                </div>

                            </article>

                        );

                    })}

                </div>

            )}

        </main>

    );
}

export default PublicUserBookPage;