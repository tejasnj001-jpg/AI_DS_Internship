import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HospitalDashboard() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responses, setResponses] = useState([]);
  const [hospital, setHospital] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadHospital();
    loadBloodRequests();
  }, []);

  // Load hospital profile
  const loadHospital = async () => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      navigate("/hospital-login");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/my-hospital/",
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setHospital(data);
      } else {
        setMessage(
          data.error || "Unable to find hospital profile."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to Django server.");
    }
  };

  // Load hospital blood requests
  const loadBloodRequests = async () => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      navigate("/hospital-login");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/my-hospital-blood-requests/",
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setRequests(data);
      } else {
        setMessage(
          data.error || "Unable to load blood requests."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to Django server.");
    }
  };

  // View donor responses
  const viewResponses = async (requestId) => {
    const accessToken = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/blood-request-responses/" +
          requestId +
          "/",
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSelectedRequest(data.blood_request);
        setResponses(data.responses);
        setMessage("");
      } else {
        setMessage(
          data.error || "Unable to load donor responses."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to Django server.");
    }
  };

  return (
    <div className="hospital-dashboard-page">

      {/* HEADER */}
      <header className="hospital-dashboard-header">
        <div className="hospital-header-content">

          <div>
            <span className="hospital-dashboard-badge">
              ✦ AI • HEALTHCARE • MATCHING
            </span>

            <h1>
              Hospital
              <span> Dashboard</span>
            </h1>

            <p>
              Manage blood requests, review donor responses,
              and coordinate life-saving matches.
            </p>

            {/* Hospital Email */}
            {hospital && (
              <p>
                📧 <strong>{hospital.email || "Email not provided"}</strong>
              </p>
            )}

            <button
              type="button"
              className="dashboard-primary-btn"
              onClick={() => navigate("/blood-request")}
            >
              🩸 Create Blood Request
              <span>→</span>
            </button>
          </div>

          <div className="hospital-header-visual">
            <div className="hospital-header-icon">
              🏥
            </div>

            <div className="hospital-ai-orbit">
              ✦
            </div>
          </div>

        </div>
      </header>

      <main className="hospital-dashboard-container">

        {/* MESSAGE */}
        {message && (
          <div className="hospital-dashboard-message">
            <span>✓</span>
            {message}
          </div>
        )}

        {/* HOSPITAL PROFILE */}
        {hospital && (
          <section className="hospital-dashboard-section">

            <div className="hospital-section-heading">
              <div>
                <span className="hospital-section-label">
                  HOSPITAL PROFILE
                </span>

                <h2>
                  {hospital.hospital_name}
                </h2>

                <p>
                  Hospital account information.
                </p>
              </div>
            </div>

            <div className="hospital-selected-request">

              <div>
                <span>Hospital Name</span>
                <strong>
                  {hospital.hospital_name}
                </strong>
              </div>

              <div>
                <span>Email</span>
                <strong>
                  {hospital.email || "Not provided"}
                </strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>
                  {hospital.phone}
                </strong>
              </div>

              <div>
                <span>Location</span>
                <strong>
                  {hospital.location}
                </strong>
              </div>

            </div>

          </section>
        )}

        {/* BLOOD REQUESTS */}
        <section className="hospital-dashboard-section">

          <div className="hospital-section-heading">

            <div>
              <span className="hospital-section-label">
                REQUEST MANAGEMENT
              </span>

              <h2>Blood Requests</h2>

              <p>
                View and monitor blood requests created by your hospital.
              </p>
            </div>

            <div className="hospital-request-counter">
              <strong>{requests.length}</strong>

              <span>
                {requests.length === 1
                  ? "Request"
                  : "Requests"}
              </span>
            </div>

          </div>

          {requests.length === 0 ? (

            <div className="hospital-empty-state">

              <div className="hospital-empty-icon">
                🩸
              </div>

              <h3>
                No blood requests available
              </h3>

              <p>
                Your hospital has not created any blood requests yet.
              </p>

            </div>

          ) : (

            <div className="hospital-request-grid">

              {requests.map((request) => (

                <article
                  className="hospital-request-card"
                  key={request.id}
                >

                  <div className="hospital-request-card-header">

                    <div className="hospital-request-title">

                      <span className="hospital-request-id">
                        REQUEST #{request.id}
                      </span>

                      <h3>
                        {request.hospital_name}
                      </h3>

                    </div>

                    <div className="hospital-blood-badge">
                      {request.blood_group}
                    </div>

                  </div>

                  <div className="hospital-ai-strip">

                    <span>✦</span>

                    <div>
                      <strong>
                        Smart Matching Active
                      </strong>

                      <small>
                        Donors are matched using compatibility,
                        location and urgency.
                      </small>
                    </div>

                  </div>

                  <div className="hospital-request-details">

                    <div className="hospital-detail-item">

                      <div className="hospital-detail-icon">
                        🩸
                      </div>

                      <div>
                        <span>Blood Group</span>

                        <strong>
                          {request.blood_group}
                        </strong>
                      </div>

                    </div>

                    <div className="hospital-detail-item">

                      <div className="hospital-detail-icon">
                        📦
                      </div>

                      <div>
                        <span>Units Required</span>

                        <strong>
                          {request.units_required}
                        </strong>
                      </div>

                    </div>

                    <div className="hospital-detail-item">

                      <div className="hospital-detail-icon">
                        📍
                      </div>

                      <div>
                        <span>Location</span>

                        <strong>
                          {request.location}
                        </strong>
                      </div>

                    </div>

                    <div className="hospital-detail-item">

                      <div className="hospital-detail-icon">
                        ⚡
                      </div>

                      <div>
                        <span>Urgency</span>

                        <strong
                          className={`hospital-urgency ${
                            request.urgency
                              ? request.urgency
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")
                              : ""
                          }`}
                        >
                          {request.urgency}
                        </strong>

                      </div>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="hospital-view-response-btn"
                    onClick={() =>
                      viewResponses(request.id)
                    }
                  >
                    <span>
                      View Donor Responses
                    </span>

                    <span className="hospital-btn-arrow">
                      →
                    </span>
                  </button>

                </article>

              ))}

            </div>

          )}

        </section>

        {/* DONOR RESPONSES */}
        {selectedRequest && (

          <section className="hospital-dashboard-section hospital-response-section">

            <div className="hospital-response-heading">

              <div>

                <span className="hospital-section-label">
                  DONOR ACTIVITY
                </span>

                <h2>
                  Donor Responses
                </h2>

                <p>
                  Review donors who have responded to this blood request.
                </p>

              </div>

              <div className="hospital-required-blood">

                <span>
                  Required
                </span>

                <strong>
                  {selectedRequest.blood_group}
                </strong>

              </div>

            </div>

            <div className="hospital-selected-request">

              <div>
                <span>Hospital</span>

                <strong>
                  {selectedRequest.hospital_name}
                </strong>
              </div>

              <div>
                <span>Blood Group</span>

                <strong>
                  {selectedRequest.blood_group}
                </strong>
              </div>

              <div>
                <span>Request ID</span>

                <strong>
                  #{selectedRequest.id}
                </strong>
              </div>

            </div>

            {responses.length === 0 ? (

              <div className="hospital-empty-state hospital-response-empty">

                <div className="hospital-empty-icon">
                  🩸
                </div>

                <h3>
                  No donors have responded yet
                </h3>

                <p>
                  Donor responses will appear here when donors
                  respond to this request.
                </p>

              </div>

            ) : (

              <div className="hospital-donor-response-grid">

                {responses.map((response) => (

                  <article
                    className="hospital-donor-card"
                    key={response.response_id}
                  >

                    <div className="hospital-donor-header">

                      <div className="hospital-donor-avatar">
                        {response.donor_name
                          ? response.donor_name
                              .charAt(0)
                              .toUpperCase()
                          : "D"}
                      </div>

                      <div className="hospital-donor-name">

                        <span>
                          DONOR
                        </span>

                        <h3>
                          {response.donor_name}
                        </h3>

                      </div>

                      <div
                        className={`hospital-status-badge hospital-status-${response.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >

                        <span>
                          {response.status === "Accepted"
                            ? "✓"
                            : response.status === "Rejected"
                            ? "×"
                            : "•"}
                        </span>

                        {response.status}

                      </div>

                    </div>

                    <div className="hospital-donor-details">

                      <div>
                        <span>
                          Blood Group
                        </span>

                        <strong className="hospital-donor-blood">
                          {response.blood_group}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Phone
                        </span>

                        <strong>
                          {response.phone}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Location
                        </span>

                        <strong>
                          {response.location}
                        </strong>
                      </div>

                    </div>

                    <div className="hospital-response-time">

                      <div className="hospital-time-icon">
                        🕒
                      </div>

                      <div>

                        <span>
                          RESPONDED AT
                        </span>

                        <strong>
                          {response.responded_at}
                        </strong>

                      </div>

                    </div>

                  </article>

                ))}

              </div>

            )}

          </section>

        )}

      </main>

      {/* FOOTER */}
      <footer className="hospital-dashboard-footer">

        <div>

          <strong>
            BloodMatch
          </strong>

          <span>
            Intelligent blood donor & hospital matching
          </span>

        </div>

        <div className="hospital-footer-tech">

          <span>✦</span>

          Medical + AI Technology

        </div>

      </footer>

    </div>
  );
}

export default HospitalDashboard;