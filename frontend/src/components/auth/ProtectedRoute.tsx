import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps{

    children:ReactNode;

}

function ProtectedRoute({

    children

}:ProtectedRouteProps){

    const { token } = useAuth();
//Le rotte protette richiedono un token JWT valido. Se non è presente, l'utente viene reindirizzato alla pagina di login.
    if(!token){

        return <Navigate to="/login" replace />;

    }

    return children;

}

export default ProtectedRoute;