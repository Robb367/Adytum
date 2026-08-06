import "./SecondaryButton.css";

interface SecondaryButtonProps{

    text:string;

    onClick?:()=>void;

}

function SecondaryButton({

    text,

    onClick

}:SecondaryButtonProps){

    return(

        <button
            className="secondary-button"
            onClick={onClick}
        >

            {text}

        </button>

    );

}

export default SecondaryButton;