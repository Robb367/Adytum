import { Outlet } from "react-router-dom";

import AppNavbar from "./AppNavbar";
import "./AppShell.css";

function AppShell() {

    return (
        <>
            <AppNavbar />

            <div className="app-shell-content">
                <Outlet />
            </div>
        </>
    );
}

export default AppShell;