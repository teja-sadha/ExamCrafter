import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
    return (
        <div className="home-page">

            {/* =========================
                Hero
            ========================= */}

            <section className="home-hero">

                <div className="home-hero-content">
                    <img
    src="/images/examcrafter-logo.png.jpeg"
    alt="ExamCrafter"
    className="home-logo"
/>

                    <div className="home-badge">
                        <span>✦</span>
                        Online Examination Platform
                    </div>

                    <h1>
                        Test your skills.
                        <br />
                        <span>Prove your knowledge.</span>
                    </h1>

                    <p>
                        ExamCrafter is a simple and
                        modern platform for online
                        MCQ examinations and coding
                        competitions.
                    </p>

                    <div className="home-buttons">

                        <Link
                            to="/register"
                            className="home-primary-button"
                        >
                            Get Started →
                        </Link>

                        <Link
                            to="/student/login"
                            className="home-secondary-button"
                        >
                            Student Login
                        </Link>

                    </div>

                </div>

                {/* =========================
                    Hero Visual
                ========================= */}

                <div className="home-visual">

                    <div className="home-floating-card card-one">
                        <span>✓</span>
                        Instant Results
                    </div>

                    <div className="home-dashboard-card">

                        <div className="mini-header">
                            <span>
                                ExamCrafter
                            </span>

                            <span className="mini-dot">
                                ●
                            </span>
                        </div>

                        <div className="mini-title">
                            Python Assessment
                        </div>

                        <div className="mini-question">
                            Which keyword is used to
                            define a function in Python?
                        </div>

                        <div className="mini-option correct">
                            <span>A</span>
                            def
                            <b>✓</b>
                        </div>

                        <div className="mini-option">
                            <span>B</span>
                            function
                        </div>

                        <div className="mini-option">
                            <span>C</span>
                            func
                        </div>

                        <div className="mini-progress">
                            <span></span>
                        </div>

                        <small>
                            Question 4 of 20
                        </small>

                    </div>

                    <div className="home-floating-card card-two">
                        <span>★</span>
                        92% Score
                    </div>

                </div>

            </section>

            {/* =========================
                Features
            ========================= */}

            <section className="home-features">

                <div className="home-section-heading">
                    <p>
                        BUILT FOR BETTER EXAMS
                    </p>

                    <h2>
                        Everything you need
                    </h2>
                </div>

                <div className="home-feature-grid">

                    <div className="home-feature-card">

                        <div className="feature-icon">
                            📝
                        </div>

                        <h3>
                            Online Exams
                        </h3>

                        <p>
                            Take timed MCQ exams
                            from anywhere with a
                            clean examination
                            experience.
                        </p>

                    </div>

                    <div className="home-feature-card">

                        <div className="feature-icon">
                            ⚡
                        </div>

                        <h3>
                            Instant Results
                        </h3>

                        <p>
                            Get your score,
                            percentage and detailed
                            performance immediately
                            after submission.
                        </p>

                    </div>

                    <div className="home-feature-card">

                        <div className="feature-icon">
                            📊
                        </div>

                        <h3>
                            Track Performance
                        </h3>

                        <p>
                            Review your previous
                            results and understand
                            your progress over time.
                        </p>

                    </div>

                </div>

            </section>

            {/* =========================
                CTA
            ========================= */}

            <section className="home-cta">

                <div>
                    <p>
                        READY TO START?
                    </p>

                    <h2>
                        Challenge yourself with
                        ExamCrafter.
                    </h2>
                </div>

                <Link
                    to="/register"
                    className="home-cta-button"
                >
                    Create Free Account →
                </Link>

            </section>

            {/* =========================
                Footer
            ========================= */}

            <footer className="home-footer">
                © {new Date().getFullYear()} ExamCrafter.
                Online Examination Platform.
            </footer>

        </div>
    );
}

export default Home;