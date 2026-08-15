import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/Landing/LandingPage";
import LoginPage from "../pages/Login/LoginPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import LibraryPage from "../pages/Library/LibraryPage";
import BookDetailsPage from "../pages/BookDetails/BookDetailsPage";
import EditBookCopyPage from "../pages/EditBookCopy/EditBookCopyPage";
import ExplorePage from "../pages/ExplorePage/ExplorePage";
import ExploreResultsPage from "../pages/ExplorePage/ExploreResultsPage";
import LoansPage from "../pages/LoansPage/LoansPage";

function AppRouter() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<LandingPage />}
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/library"
                    element={
                        <ProtectedRoute>
                            <LibraryPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/books/:bookCopyId"
                    element={
                        <ProtectedRoute>
                            <BookDetailsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/books/:bookCopyId/edit"
                    element={
                        <ProtectedRoute>
                            <EditBookCopyPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/explore"
                    element={
                        <ProtectedRoute>
                            <ExplorePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/explore/results"
                    element={
                        <ProtectedRoute>
                            <ExploreResultsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/loans"
                    element={
                        <ProtectedRoute>
                            <LoansPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>

        </BrowserRouter>

    );

}

export default AppRouter;