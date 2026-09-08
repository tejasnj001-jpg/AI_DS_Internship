import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DonorRegistration() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    blood_group: "",
    phone: "",
    email:"",
    location: "",
    latitude: "",
    longitude: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/donor-register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            name: formData.name,
            blood_group: formData.blood_group,
            phone: formData.phone,
            email:formData.email,
            location: formData.location,
            latitude: formData.latitude,
            longitude: formData.longitude,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Donor registered successfully! 🩸 Please login."
        );

        setFormData({
          username: "",
          password: "",
          name: "",
          blood_group: "",
          phone: "",
          email:"",
          location: "",
          latitude: "",
          longitude: "",
        });

        setTimeout(() => {
          navigate("/donor-login");
        }, 1000);
      } else {
        setMessage(
          data.error || "Failed to register donor."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to Django server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-page">
      
      {/* Main Registration Area */}
      <main className="registration-container">

        {/* Left Information Panel */}
        <section className="registration-info">

          <div className="info-badge">
            🩸 DONOR COMMUNITY
          </div>

          <h1>
            Become someone's
            <span> reason to smile.</span>
          </h1>

          <p>
            Register as a blood donor and help hospitals find
            suitable donors when patients need blood urgently.
          </p>

          <div className="info-points">

            <div className="info-point">
              <div className="info-point-icon">✓</div>
              <div>
                <strong>Smart Matching</strong>
                <small>
                  Blood-group compatibility based matching
                </small>
              </div>
            </div>

            <div className="info-point">
              <div className="info-point-icon">📍</div>
              <div>
                <strong>Location Based</strong>
                <small>
                  Helps hospitals identify nearby donors
                </small>
              </div>
            </div>

            <div className="info-point">
              <div className="info-point-icon">⚡</div>
              <div>
                <strong>Emergency Ready</strong>
                <small>
                  Respond to urgent blood requirements quickly
                </small>
              </div>
            </div>

          </div>

        </section>


        {/* Registration Card */}
        <section className="registration-card">

          <div className="form-header">

            <div className="form-icon">
              🩸
            </div>

            <div>
              <h2>Donor Registration</h2>

              <p>
                Create your donor account
              </p>
            </div>

          </div>


          <form onSubmit={handleSubmit}>

            {/* Account Details */}
            <div className="form-section-title">
              Account Details
            </div>

            <div className="form-grid">

              <div className="form-field">
                <label>Username</label>

                <input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="form-field">
                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>


            {/* Personal Details */}
            <div className="form-section-title">
              Personal Details
            </div>

            <div className="form-grid">

              <div className="form-field full-width">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="form-field">
                <label>Blood Group</label>

                <select
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select blood group
                  </option>

                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>

              </div>


              <div className="form-field">
                <label>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-field">
                <label>Email Address</label>

                <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
                />
              </div>

              <div className="form-field full-width">
                <label>Location</label>

                <input
                  type="text"
                  name="location"
                  placeholder="Example: Tumakuru"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* Location Coordinates */}
            <div className="form-section-title">
              Location Coordinates
            </div>

            <p className="coordinates-help">
              📍 Coordinates help the system calculate donor distance
              during matching.
            </p>

            <div className="form-grid">

              <div className="form-field">
                <label>Latitude</label>

                <input
                  type="number"
                  step="any"
                  name="latitude"
                  placeholder="Example: 13.3379"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-field">
                <label>Longitude</label>

                <input
                  type="number"
                  step="any"
                  name="longitude"
                  placeholder="Example: 77.1173"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* Submit */}
            <button
              type="submit"
              className="register-submit-btn"
              disabled={isLoading}
            >
              {isLoading
                ? "Creating Account..."
                : "Create Donor Account →"}
            </button>

          </form>


          {/* Message */}
          {message && (
            <div
              className={`registration-message ${
                message.includes("successfully")
                  ? "success"
                  : "error"
              }`}
            >
              {message}
            </div>
          )}


          <p className="login-hint">
            Already registered?
            <button
              onClick={() => navigate("/donor-login")}
            >
              Login here
            </button>
          </p>

        </section>

      </main>

    </div>
  );
}

export default DonorRegistration;