import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Student pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentExams from "./pages/student/Exams";
import StudentExam from "./pages/student/Exam";
import StudentResult from "./pages/student/Result";
import StudentResults from "./pages/student/Results";

// Admin pages
import CreateExam from "./pages/admin/CreateExam";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminExams from "./pages/admin/Exams";
import AddQuestions from "./pages/admin/AddQuestions";
import AdminResults from "./pages/admin/Results";
import AdminResultDetails from "./pages/admin/ResultDetails";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* =========================
                    Public Routes
                ========================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* =========================
                    Student Routes
                ========================= */}

                <Route
                    path="/student/dashboard"
                    element={
                        <ProtectedRoute role="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/exams"
                    element={
                        <ProtectedRoute role="student">
                            <StudentExams />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/exam/:id"
                    element={
                        <ProtectedRoute role="student">
                            <StudentExam />
                        </ProtectedRoute>
                    }
                />

                {/* All Student Results */}

                <Route
                    path="/student/results"
                    element={
                        <ProtectedRoute role="student">
                            <StudentResults />
                        </ProtectedRoute>
                    }
                />

                {/* Individual Student Result */}

                <Route
                    path="/student/results/:examId"
                    element={
                        <ProtectedRoute role="student">
                            <StudentResult />
                        </ProtectedRoute>
                    }
                />

                {/* =========================
                    Admin Routes
                ========================= */}

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Exams */}

                <Route
                    path="/admin/exams"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminExams />
                        </ProtectedRoute>
                    }
                />

                {/* Create Exam */}

                <Route
                    path="/admin/exams/create"
                    element={
                        <ProtectedRoute role="admin">
                            <CreateExam />
                        </ProtectedRoute>
                    }
                />

                {/* Manage Questions */}

                <Route
                    path="/admin/exams/:examId/questions"
                    element={
                        <ProtectedRoute role="admin">
                            <AddQuestions />
                        </ProtectedRoute>
                    }
                />

                {/* All Admin Results */}

                <Route
                    path="/admin/results"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminResults />
                        </ProtectedRoute>
                    }
                />

                {/* Individual Admin Result */}

                <Route
                    path="/admin/results/:resultId"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminResultDetails />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;