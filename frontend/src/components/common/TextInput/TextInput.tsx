import "./TextInput.css";

interface TextInputProps{

    label:string;

    type?:string;

    value:string;

    placeholder?:string;

    onChange:(value:string)=>void;

}

function TextInput({

    label,

    type="text",

    value,

    placeholder,

    onChange

}:TextInputProps){

    return(

        <div className="text-input">

            <label>

                {label}

            </label>

            <input

                type={type}

                value={value}

                placeholder={placeholder}

                onChange={(e)=>onChange(e.target.value)}

            />

        </div>

    );

}

export default TextInput;