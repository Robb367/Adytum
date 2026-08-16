import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import "./AppNavbar.css";

function AppNavbar() {

    const { logout } = useAuth();
    const navigate = useNavigate();

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