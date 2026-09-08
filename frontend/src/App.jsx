import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import DonorRegistration from "./pages/DonorRegistration";
import HospitalLogin from "./pages/HospitalLogin";
import FindDonor from "./pages/FindDonor";
import BloodRequest from "./pages/BloodRequest";
import DonorDashboard from "./pages/DonorDashboard";
import DonorLogin from "./pages/DonorLogin";
import HospitalDashboard from "./pages/HospitalDashboard";
import HospitalRegistration from "./pages/HospitalRegistration";
import Navbar from "./Components/Navbar";


function Home() {
  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            🩸 AI-Powered Blood Donor Matching
          </div>

          <h1>
            Every Drop of Blood
            <br />
            <span>Can Save a Life.</span>
          </h1>

          <p>
            Connect hospitals with suitable blood donors quickly
            using intelligent blood-group compatibility, location
            and urgency-based matching.
          </p>

          <div className="hero-buttons">

            <Link to="/find-donor" className="primary-btn">
              Find a Blood Donor →
            </Link>

            <Link to="/donor-registration" className="secondary-btn">
              Become a Donor
            </Link>

          </div>

        </div>


        {/* Blood Drop Illustration */}
        <div className="hero-visual">
          <div className="blood-circle">
            🩸
          </div>

          <div className="floating-card card-one">
            ✓ Compatible
          </div>

          <div className="floating-card card-two">
            📍 Nearby Donor
          </div>

          <div className="floating-card card-three">
            🚨 Emergency Match
          </div>
        </div>

      </section>


      {/* Features */}
      <section className="features-section">

        <div className="section-heading">
          <p className="small-title">HOW IT WORKS</p>

          <h2>
            Faster Matching. Faster Help.
          </h2>

          <p>
            Our system helps connect hospitals and donors when
            every second matters.
          </p>
        </div>


        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">🩸</div>

            <h3>Blood Compatibility</h3>

            <p>
              Automatically identifies donors compatible with
              the required blood group.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-icon">📍</div>

            <h3>Location Matching</h3>

            <p>
              Finds suitable donors based on distance and
              location to help reduce response time.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-icon">🚨</div>

            <h3>Urgency Priority</h3>

            <p>
              Emergency requests can be prioritized so that
              critical patients receive faster assistance.
            </p>
          </div>

        </div>

      </section>


      {/* Call To Action */}
      <section className="cta-section">

        <h2>
          Ready to Make a Difference?
        </h2>

        <p>
          Register as a donor or connect your hospital with
          our intelligent matching system.
        </p>

        <div className="cta-buttons">

          <Link to="/donor-registration" className="primary-btn">
            Register as Donor
          </Link>

          <Link to="/hospital-login" className="secondary-btn">
            Hospital Login
          </Link>

        </div>

      </section>


      {/* Footer */}
      <footer className="footer">

        <div>
          🩸 <strong>BloodMatch</strong>
        </div>

        <p>
          AI-Based Blood Donor Hospital Matching System
        </p>

        <p>
          © 2026 BloodMatch. Saving lives through technology.
        </p>

      </footer>

    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/donor-registration"
          element={<DonorRegistration />}
        />

        <Route
          path="/hospital-login"
          element={<HospitalLogin />}
        />

        <Route
          path="/donor-login"
          element={<DonorLogin />}
        />

        <Route
          path="/find-donor"
          element={<FindDonor />}
        />

        <Route
          path="/blood-request"
          element={<BloodRequest />}
        />

        <Route
          path="/donor-dashboard"
          element={<DonorDashboard />}
        />

        <Route
          path="/hospital-dashboard"
          element={<HospitalDashboard />}
        />

        <Route
          path="/hospital-registration"
          element={<HospitalRegistration />}
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;