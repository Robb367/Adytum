import "./PrimaryButton.css";

interface PrimaryButtonProps {
    text: string;
    onClick?: () => void;
    type?: "button" | "submit";
    disabled?: boolean;
}

function PrimaryButton({
    text,
    onClick,
    type = "button",
    disabled = false,
    
}: PrimaryButtonProps) {

    return (

        <button
            className="primary-button"
            type={type}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>

    );

}

export default PrimaryButton;