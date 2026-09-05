interface AdminBarChartItem {
    label: string;
    value: number;
}

interface AdminBarChartProps {
    title: string;
    subtitle?: string;
    items: AdminBarChartItem[];
}

function AdminBarChart({
    title,
    subtitle,
    items
}: AdminBarChartProps) {

    const maxValue =
        Math.max(
            ...items.map(item => item.value),
            1
        );

    return (
        <section className="admin-chart-card">

            <div className="admin-chart-heading">

                <p className="section-eyebrow">
                    Analisi
                </p>

                <h2>
                    {title}
                </h2>

                {subtitle && (
                    <p>
                        {subtitle}
                    </p>
                )}

            </div>

            <div className="admin-bar-chart">

                {items.map(item => {

                    const percentage =
                        (item.value / maxValue) * 100;

                    return (

                        <div
                            key={item.label}
                            className="admin-bar-row"
                        >

                            <div className="admin-bar-label">

                                <span>
                                    {item.label}
                                </span>

                                <strong>
                                    {item.value}
                                </strong>

                            </div>

                            <div className="admin-bar-track">

                                <div
                                    className="admin-bar-fill"
                                    style={{
                                        width:
                                            `${percentage}%`
                                    }}
                                />

                            </div>

                        </div>

                    );

                })}

            </div>

        </section>
    );
}

export default AdminBarChart;