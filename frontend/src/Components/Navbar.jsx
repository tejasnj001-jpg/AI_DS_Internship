import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        🩸 <span>BloodMatch</span>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/find-donor">Find Donor</Link>
        <Link to="/donor-registration">Become a Donor</Link>
        <Link to="/hospital-login">Hospital</Link>
      </div>
    </nav>
  );
}

export default Navbar;