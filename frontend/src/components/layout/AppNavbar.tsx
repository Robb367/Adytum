import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import "./AppNavbar.css";

function getRoleFromToken(
    token: string | null
): string | null {

    if (!token) {
        return null;
    }

    try {

        const payload =
            JSON.parse(
                atob(
                    token.split(".")[1]
                )
            );

        return (
            payload.role ??
            payload[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ] ??
            null
        );

    }
    catch {

        return null;

    }
}

function AppNavbar() {

    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const role = getRoleFromToken(token);
    const isAdmin = role === "Admin";

    function handleLogout() {

        logout();
        navigate("/login");

    }

    return (
        <header className="app-navbar">

            <button
                className="app-navbar-brand"
                onClick={() => navigate("/dashboard")}
            >
                ADYTUM
            </button>

            <nav className="app-navbar-links">

                <NavLink
                    to="/explore"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Esplora
                </NavLink>

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/library"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Biblioteca
                </NavLink>

                <NavLink
                    to="/loans"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Prestiti
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Profilo
                </NavLink>


                {isAdmin && (

                    <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Admin
                    </NavLink>

                )}


            </nav>

            <button
                className="app-navbar-logout"
                onClick={handleLogout}
            >
                Esci
            </button>

        </header>
    );
}

export default AppNavbar;