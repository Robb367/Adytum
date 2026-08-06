import "./Brand.css";

interface BrandProps{

    size?:"small"|"medium"|"large";

    subtitle?:boolean;

}

function Brand({

    size="medium",

    subtitle=true

}:BrandProps){

    return(

        <div className="brand">

            <h1 className={`brand-logo ${size}`}>

                ADYTUM

            </h1>

            {

                subtitle && (

                    <p className="brand-subtitle">

                        La tua biblioteca.
                        <br/>

                        Vicino a te.

                    </p>

                )

            }

        </div>

    );

}

export default Brand;