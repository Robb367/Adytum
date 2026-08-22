import type {
    DashboardViewPoint
} from "../../services/DashboardService";

import "./ViewsChart.css";


interface ViewsChartProps {
    data: DashboardViewPoint[];
}


function ViewsChart({
    data
}: ViewsChartProps) {

    const width = 700;
    const height = 220;

    const paddingX = 24;
    const paddingY = 28;

    const maxViews =
        Math.max(
            ...data.map(point => point.views),
            1
        );

    const usableWidth =
        width - paddingX * 2;

    const usableHeight =
        height - paddingY * 2;


    const points =
        data.map((point, index) => {

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
                    point.views /
                    maxViews
                ) * usableHeight;

            return {
                ...point,
                x,
                y
            };

        });


    const polyline =
        points
            .map(point =>
                `${point.x},${point.y}`
            )
            .join(" ");


    return (

        <section className="views-chart-card">

            <div className="views-chart-header">

                <div>

                    <p className="section-eyebrow">
                        Attività
                    </p>

                    <h2>
                        Visualizzazioni negli ultimi 30 giorni
                    </h2>

                </div>

            </div>


            <div className="views-chart-wrapper">

                <svg
                    className="views-chart"
                    viewBox={`0 0 ${width} ${height}`}
                    role="img"
                    aria-label="Grafico delle visualizzazioni dei libri negli ultimi 30 giorni"
                >

                    <line
                        x1={paddingX}
                        y1={height - paddingY}
                        x2={width - paddingX}
                        y2={height - paddingY}
                        className="views-chart-axis"
                    />

                    <line
                        x1={paddingX}
                        y1={paddingY}
                        x2={paddingX}
                        y2={height - paddingY}
                        className="views-chart-axis"
                    />


                    <polyline
                        points={polyline}
                        className="views-chart-line"
                    />


                    {points.map((point) => (

                        <circle
                            key={point.date}
                            cx={point.x}
                            cy={point.y}
                            r="4"
                            className="views-chart-point"
                        >

                            <title>
                                {
                                    new Date(
                                        point.date
                                    ).toLocaleDateString(
                                        "it-IT"
                                    )
                                }
                                {": "}
                                {point.views}
                                {" visualizzazioni"}
                            </title>

                        </circle>

                    ))}

                </svg>


                <div className="views-chart-labels">

                    <span>
                        {data.length > 0
                            ? new Date(
                                data[0].date
                            ).toLocaleDateString(
                                "it-IT",
                                {
                                    day: "2-digit",
                                    month: "short"
                                }
                            )
                            : ""}
                    </span>

                    <span>
                        Oggi
                    </span>

                </div>

            </div>

        </section>

    );

}


export default ViewsChart;