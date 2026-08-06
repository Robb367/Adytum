import "./PageContainer.css";
import type { ReactNode } from "react";

interface PageContainerProps{

    children:ReactNode;

    background?:string;

}

function PageContainer({

    children,

    background

}:PageContainerProps){

    return(

        <div

            className="page-container"

            style={{

                backgroundImage:
                    background
                        ? `url(${background})`
                        : undefined

            }}

        >

            <div className="page-overlay">

                {children}

            </div>

        </div>

    );

}

export default PageContainer;