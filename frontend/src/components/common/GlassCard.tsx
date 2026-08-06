import "./GlassCard.css";
import type { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
}

function GlassCard({
    children,
    className = ""
}: GlassCardProps) {

    return (

        <div className={`glass-card ${className}`}>

            {children}

        </div>

    );

}

export default GlassCard;