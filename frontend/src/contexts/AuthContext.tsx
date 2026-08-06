import {
    createContext,
    useContext,
    useState,
    useEffect
} from "react";

import type { ReactNode } from "react";

interface AuthContextType {

    token: string | null;

    login: (token: string) => void;

    logout: () => void;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {

    children: ReactNode;

}

export function AuthProvider({

    children

}: AuthProviderProps) {

    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {

        const savedToken = localStorage.getItem("token");

        if (savedToken) {

            setToken(savedToken);

        }

    }, []);

    function login(token: string) {

        localStorage.setItem("token", token);

        setToken(token);

    }

    function logout() {

        localStorage.removeItem("token");

        setToken(null);

    }

    return (

        <AuthContext.Provider
            value={{
                token,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {

        throw new Error("useAuth deve essere usato dentro AuthProvider.");

    }

    return context;

}