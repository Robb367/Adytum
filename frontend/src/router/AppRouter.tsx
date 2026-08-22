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
import AppShell from "../components/layout/AppShell";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import AddBookPage from "../pages/Library/AddBookPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import PublicProfilePage from "../pages/ProfilePage/PublicProfilePage";
import PublicUserBookPage from "../pages/Library/PublicUserBookPage";


function AppRouter() {

    return (

        <BrowserRouter>

            <Routes>
                <Route element={<AppShell />}>

                    <Route
                        path="/"
                        element={<LandingPage />}
                    />

                    <Route
                        path="/login"
                        element={<LoginPage />}
                    />

                    <Route
                        path="/register"
                        element={<RegisterPage />}
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
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
                        path="/users/:userId"
                        element={
                            <ProtectedRoute>
                                <PublicProfilePage />
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
                        path="/books/add"
                        element={<AddBookPage />}
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

                    {<Route
                        path="/users/:userId/books"
                        element={<PublicUserBookPage />}
                    />}
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
                </Route>
            </Routes>

        </BrowserRouter>

    );

}

export default AppRouter;