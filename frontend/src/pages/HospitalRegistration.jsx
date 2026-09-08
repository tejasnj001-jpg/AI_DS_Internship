import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HospitalRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    hospital_name: "",
    location: "",
    latitude: "",
    longitude: "",
    phone: "",
    email:"",
  });

  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/hospital-register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            hospital_name: formData.hospital_name,
            location: formData.location,
            latitude: formData.latitude
              ? Number(formData.latitude)
              : null,
            longitude: formData.longitude
              ? Number(formData.longitude)
              : null,
            phone: formData.phone,
            email:formData.email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Hospital registered successfully! 🏥"
        );

        setFormData({
          username: "",
          password: "",
          hospital_name: "",
          location: "",
          latitude: "",
          longitude: "",
          phone: "",
          email:"",
        });

        setTimeout(() => {
          navigate("/hospital-login");
        }, 1500);
      } else {
        setMessage(
          data.error ||
          "Hospital registration failed."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to Django server.");
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <div className="dashboard-badge">
            AI • HEALTHCARE • REGISTRATION
          </div>

          <h1>Hospital Registration</h1>

          <p>
            Register your hospital to create blood requests
            and find suitable donors.
          </p>
        </div>

        <div className="dashboard-header-icon">
          🏥
        </div>
      </div>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <span className="section-label">
              HOSPITAL ACCOUNT
            </span>

            <h2>Create Hospital Profile</h2>

            <p>
              Enter your hospital details below.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="hospital-registration-form"
        >
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <div className="form-group">
            <label>Hospital Name</label>
            <input
              type="text"
              name="hospital_name"
              value={formData.hospital_name}
              onChange={handleChange}
              placeholder="Enter hospital name"
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Example: Tumakuru"
              required
            />
          </div>

          <div className="form-group">
            <label>Latitude</label>
            <input
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="Example: 13.3379"
            />
          </div>

          <div className="form-group">
            <label>Longitude</label>
            <input
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="Example: 77.1173"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              step="any"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Example: user@gmail.com"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter hospital phone number"
              required
            />
          </div>

          <button
            type="submit"
            className="dashboard-primary-btn"
          >
            🏥 Register Hospital
            <span>→</span>
          </button>
        </form>

        {message && (
          <div className="dashboard-message">
            {message}
          </div>
        )}
      </section>
    </div>
  );
}

export default HospitalRegistration;