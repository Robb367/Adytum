import type {
    AdminActivityPoint
} from "../../services/AdminService";


interface Props {
    data: AdminActivityPoint[];
}


function AdminActivityChart({
    data
}: Props) {

    if (!data || data.length === 0) {

        return (

            <section className="admin-activity-chart-card">

                <div className="admin-chart-heading">

                    <p className="section-eyebrow">
                        Andamento
                    </p>

                    <h2>
                        Attività negli ultimi 30 giorni
                    </h2>

                    <p>
                        Non ci sono ancora dati sufficienti
                        per mostrare l'andamento.
                    </p>

                </div>

            </section>

        );
    }


    const width = 900;
    const height = 260;

    const paddingX = 36;
    const paddingY = 32;


    const maxValue =
        Math.max(
            ...data.map(point =>
                Math.max(
                    point.newUsers,
                    point.newBooks
                )
            ),
            1
        );


    const usableWidth =
        width - paddingX * 2;

    const usableHeight =
        height - paddingY * 2;


    function buildPoints(
        key: "newUsers" | "newBooks"
    ) {

        return data.map(
            (point, index) => {

                const x =
                    paddingX +
                    (
                        data.length <= 1
                            ? 0
                            : index /
                              (data.length - 1)
                    ) * usableWidth;

                const y =
                    height -
                    paddingY -
                    (
                        point[key] /
                        maxValue
                    ) * usableHeight;


                return {
                    ...point,
                    x,
                    y
                };

            }
        );
    }


    const userPoints =
        buildPoints("newUsers");

    const bookPoints =
        buildPoints("newBooks");


    const userPolyline =
        userPoints
            .map(
                point =>
                    `${point.x},${point.y}`
            )
            .join(" ");


    const bookPolyline =
        bookPoints
            .map(
                point =>
                    `${point.x},${point.y}`
            )
            .join(" ");


    return (

        <section className="admin-activity-chart-card">

            <div className="admin-chart-heading">

                <p className="section-eyebrow">
                    Andamento
                </p>

                <h2>
                    Attività negli ultimi 30 giorni
                </h2>

                <p>
                    Nuovi utenti e libri aggiunti
                    alla piattaforma.
                </p>

            </div>


            <div className="admin-activity-legend">

                <span className="admin-legend-users">
                    Utenti
                </span>

                <span className="admin-legend-books">
                    Libri
                </span>

            </div>


            <svg
                className="admin-activity-chart"
                viewBox={`0 0 ${width} ${height}`}
                role="img"
                aria-label="Andamento di nuovi utenti e libri aggiunti negli ultimi 30 giorni"
            >

                <line
                    x1={paddingX}
                    y1={height - paddingY}
                    x2={width - paddingX}
                    y2={height - paddingY}
                    className="admin-chart-axis"
                />


                <polyline
                    points={userPolyline}
                    className="admin-chart-users-line"
                />


                <polyline
                    points={bookPolyline}
                    className="admin-chart-books-line"
                />

            </svg>


            <div className="admin-chart-dates">

                <span>
                    {
                        new Date(
                            data[0].date
                        ).toLocaleDateString(
                            "it-IT",
                            {
                                day: "2-digit",
                                month: "short"
                            }
                        )
                    }
                </span>

                <span>
                    Oggi
                </span>

            </div>

        </section>

    );
}


export default AdminActivityChart;