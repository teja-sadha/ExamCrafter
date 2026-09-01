import { Link } from "react-router-dom";
import "../styles/home.css";

const featureCards = [
    { icon: "📝", title: "MCQ Exams", text: "Assess knowledge with structured multiple-choice assessments and section-based tests." },
    { icon: "💻", title: "Coding Exams", text: "Run practical coding challenges with language-based problem statements and interactive evaluation." },
    { icon: "⚡", title: "Online Code Execution", text: "Students can write, run, and validate code directly within the exam workflow." },
    { icon: "🧩", title: "Exam Sections", text: "Organize assessments into sections like aptitude, technical, and programming rounds." },
    { icon: "🔒", title: "Secure Student Access", text: "Admins control student access by assigning eligible email addresses to each exam." },
    { icon: "📅", title: "Exam Scheduling", text: "Set start and end date-times to manage access windows and availability precisely." },
    { icon: "✅", title: "Automatic Evaluation", text: "Capture submissions, scoring, and result summaries for quick assessment review." },
    { icon: "📊", title: "Results", text: "Track completion status, marks, and performance with a clear student results dashboard." }
];

function Home() {
    return (
        <div className="home-page">
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
                        ExamCrafter – <span>Online Examination Platform</span>
                    </h1>

                    <p>
                        Manage assessments for colleges, teachers, training institutes, and organizations with secure MCQ and coding-based exam workflows.
                    </p>

                    <div className="home-buttons">
                        <Link to="/student/login" className="home-primary-button">
                            Student Login
                        </Link>
                        <Link to="/admin/login" className="home-secondary-button">
                            Admin Login
                        </Link>
                    </div>

                    <div className="home-mini-actions">
                        <Link to="/register" className="home-text-link">Student Register</Link>
                        <Link to="/admin/register" className="home-text-link">Admin Register</Link>
                    </div>
                </div>

                <div className="home-visual">
                    <div className="home-floating-card card-one">
                        <span>✓</span>
                        Exam Scheduling
                    </div>

                    <div className="home-dashboard-card">
                        <div className="mini-header">
                            <span>ExamCrafter</span>
                            <span className="mini-dot">●</span>
                        </div>

                        <div className="mini-title">Technical Assessment</div>

                        <div className="mini-question">Which section of an exam can include coding tasks and practical evaluation?</div>

                        <div className="mini-option correct">
                            <span>A</span>
                            Coding Section
                            <b>✓</b>
                        </div>

                        <div className="mini-option">
                            <span>B</span>
                            General Notes
                        </div>

                        <div className="mini-option">
                            <span>C</span>
                            Informal Quiz
                        </div>

                        <div className="mini-progress">
                            <span></span>
                        </div>

                        <small>Section 2 of 4 • Online Code Execution</small>
                    </div>

                    <div className="home-floating-card card-two">
                        <span>★</span>
                        Results Ready
                    </div>
                </div>
            </section>

            <section className="home-features">
                <div className="home-section-heading">
                    <p>BUILT FOR MODERN EXAM DELIVERY</p>
                    <h2>Everything your campus or organization needs</h2>
                </div>

                <div className="home-feature-grid">
                    {featureCards.map((feature) => (
                        <div key={feature.title} className="home-feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="home-audience">
                <div className="home-section-heading">
                    <p>WHO IT SERVES</p>
                    <h2>Built for assessments across education and training</h2>
                </div>

                <div className="audience-grid">
                    <div className="audience-pill">Colleges</div>
                    <div className="audience-pill">Teachers</div>
                    <div className="audience-pill">Training Institutes</div>
                    <div className="audience-pill">Organizations</div>
                    <div className="audience-pill">Technical Assessments</div>
                </div>
            </section>

            <section className="home-cta">
                <div>
                    <p>READY TO START?</p>
                    <h2>Deliver secure, modern assessments with ExamCrafter.</h2>
                </div>

                <Link to="/student/login" className="home-cta-button">
                    Student Login →
                </Link>
            </section>

            <footer className="home-footer">
                © {new Date().getFullYear()} ExamCrafter. Online Examination Platform.
            </footer>
        </div>
    );
}

export default Home;