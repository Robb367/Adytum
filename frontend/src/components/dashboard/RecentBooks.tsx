import "./RecentBooks.css";

import type { RecentBook } from "../../services/DashboardService";
import { getImageUrl } from "../../utils/imageUrl";
import { useNavigate } from "react-router-dom";

interface RecentBooksProps {

    books: RecentBook[];

}

function RecentBooks({
    books
}: RecentBooksProps) {

    const navigate = useNavigate();

    return (

        <section className="recent-books">

            <div className="section-heading">

                <div>

                    <p className="section-eyebrow">
                        La tua collezione
                    </p>

                    <h2>
                        Ultime aggiunte
                    </h2>

                </div>

                <button
                    className="section-link"
                    onClick={() => navigate("/library")}
                >
                    Vedi biblioteca
                </button>

            </div>

            {books.length === 0 ? (

                <div className="empty-books">

                    <span>✦</span>

                    <p>
                        La tua biblioteca è ancora vuota.
                    </p>

                    <small>
                        È tempo di iniziare una nuova storia.
                    </small>

                </div>

            ) : (

                <div className="recent-books-grid">

                    {books.map((book) => {

                        const coverUrl = getImageUrl(book.coverUrl);

                        return (

                            <article
                                className="recent-book"
                                key={book.bookCopyId}
                                onClick={() =>
                                    navigate(
                                        `/books/${book.bookCopyId}`
                                    )
                                }
                            >

                                <div className="book-cover">

                                    {coverUrl ? (

                                        <img
                                            src={coverUrl}
                                            alt={`Copertina di ${book.title}`}
                                        />

                                    ) : (

                                        <div className="book-cover-placeholder">

                                            <span>✦</span>

                                            <p>
                                                Nessuna
                                                <br />
                                                copertina
                                            </p>

                                        </div>

                                    )}

                                </div>

                                <div className="book-info">

                                    <h3>{book.title}</h3>

                                    <p>{book.author}</p>

                                </div>

                            </article>

                        );

                    })}

                </div>

            )}

        </section>

    );

}

export default RecentBooks;