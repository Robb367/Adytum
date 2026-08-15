import "./StatCard.css";

interface StatCardProps {

    label: string;

    value: number;

    description?: string;

    onClick?: () => void;

}

function StatCard({
    label,
    value,
    description,
    onClick
}: StatCardProps) {

    return (

        <article
            className={`stat-card ${onClick ? "stat-card-clickable" : ""}`}
            onClick={onClick}
        >

            <div className="stat-card-symbol">
                ✦
            </div>

            <p className="stat-card-label">
                {label}
            </p>

            <p className="stat-card-value">
                {value}
            </p>

            {description && (

                <p className="stat-card-description">
                    {description}
                </p>

            )}

        </article>

    );

}

export default StatCard;