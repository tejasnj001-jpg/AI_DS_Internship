import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DonorDashboard() {
  const [requests, setRequests] = useState([]);
  const [donor, setDonor] = useState(null);
  const [message, setMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const loadDonor = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        navigate("/donor-login");
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/my-donor/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setDonor(data);
        } else {
          setMessage(
            data.error || "Unable to find donor profile."
          );
        }
      } catch (error) {
        console.error(error);
        setMessage("Cannot connect to Django server.");
      }
    };

    const loadRequests = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        navigate("/donor-login");
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/my-blood-requests/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
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

    loadDonor();
    loadRequests();
  }, [navigate]);

  const respondToRequest = async (requestId, status) => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      navigate("/donor-login");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/donor-responses/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            blood_request: requestId,
            status: status,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResponseStatus((previous) => ({
          ...previous,
          [requestId]: status,
        }));

        setMessage(
          `Request ${status.toLowerCase()} successfully! 🩸`
        );
      } else {
        setMessage(
          data.error || "Unable to save response."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to Django server.");
    }
  };

  return (
    <div className="donor-dashboard-page">

      <nav className="donor-top-nav">

        <div className="donor-brand">
          <div className="donor-brand-icon">✚</div>

          <div>
            <h2>BloodMatch</h2>
            <span>Donor Portal</span>
          </div>
        </div>

        <div className="donor-account-status">
          <span></span>
          Account Active
        </div>

      </nav>

      <main className="donor-main-container">

        <section className="donor-hero">

          <div className="donor-hero-content">

            <span className="donor-page-badge">
              🩸 DONOR DASHBOARD
            </span>

            <h1>
              Welcome back,
              <br />
              <span>
                {donor ? donor.name : "Donor"}
              </span>
            </h1>

            <p>
              Your donation could be the connection that
              helps save a life. View compatible requests
              and respond when you can help.
            </p>

            <div className="donor-hero-stats">

              <div>
                <strong>
                  {requests.length}
                </strong>
                <span>Matched Requests</span>
              </div>

              <div>
                <strong>
                  {donor?.blood_group || "--"}
                </strong>
                <span>Blood Group</span>
              </div>

              <div>
                <strong>
                  {donor?.is_available === false
                    ? "Off"
                    : "On"}
                </strong>
                <span>Availability</span>
              </div>

            </div>

          </div>

          <div className="donor-ai-card">

            <div className="donor-ai-symbol">
              ✦
            </div>

            <span>INTELLIGENT MATCHING</span>

            <h3>
              AI-Powered
              <br />
              Donor Matching
            </h3>

            <p>
              Our matching system considers blood
              compatibility, distance and urgency to
              identify relevant requests.
            </p>

            <div className="ai-card-footer">
              <span>● Matching Engine</span>
              <strong>ACTIVE</strong>
            </div>

          </div>

        </section>

        {message && (
          <div className="donor-dashboard-message">
            <span>✓</span>
            {message}
          </div>
        )}

        {donor && (
          <section className="donor-profile-panel">

            <div className="profile-panel-header">

              <div className="profile-user">

                <div className="profile-avatar-large">
                  {donor.name
                    ? donor.name
                        .charAt(0)
                        .toUpperCase()
                    : "D"}
                </div>

                <div>
                  <span>
                    YOUR DONOR PROFILE
                  </span>

                  <h2>
                    {donor.name}
                  </h2>

                  <p>
                    Registered Blood Donor
                  </p>
                </div>

              </div>

              <div className="profile-active-pill">
                <span></span>
                Available to Help
              </div>

            </div>

            <div className="profile-information">

              <div className="profile-information-item">
                <span>DONOR ID</span>
                <strong>
                  #{donor.id}
                </strong>
              </div>

              <div className="profile-information-item blood-profile-item">
                <span>BLOOD GROUP</span>

                <strong>
                  {donor.blood_group}
                </strong>
              </div>

              <div className="profile-information-item">
                <span>LOCATION</span>

                <strong>
                  📍 {donor.location}
                </strong>
              </div>

              <div className="profile-information-item">
                <span>EMAIL</span>

                <strong>
                  📧 {donor.email || "Not provided"}
                </strong>
              </div>

              <div className="profile-information-item">
                <span>AVAILABILITY</span>

                <strong className="profile-available">
                  ● Available
                </strong>
              </div>

            </div>

          </section>
        )}

        <section className="donor-requests-section">

          <div className="donor-requests-heading">

            <div>
              <span className="donor-section-label">
                SMART MATCHES
              </span>

              <h2>
                Compatible Blood Requests
              </h2>

              <p>
                Requests intelligently matched with your
                donor profile.
              </p>
            </div>

            <div className="donor-request-counter">
              <strong>
                {requests.length}
              </strong>

              <span>
                Active Matches
              </span>
            </div>

          </div>

          {requests.length === 0 ? (

            <div className="donor-empty-state">

              <div className="donor-empty-icon">
                🩸
              </div>

              <h3>
                No compatible requests
              </h3>

              <p>
                There are currently no blood requests
                matching your donor profile.
              </p>

            </div>

          ) : (

            <div className="donor-request-grid">

              {requests.map((request) => {

                const currentResponse =
                  responseStatus[request.id] ||
                  request.response_status;

                return (

                  <article
                    className="donor-request-card"
                    key={request.id}
                  >

                    <div className="donor-request-card-header">

                      <div className="hospital-request-icon">
                        ✚
                      </div>

                      <div className="hospital-request-title">
                        <span>
                          HOSPITAL REQUEST
                        </span>

                        <h3>
                          {request.hospital_name}
                        </h3>
                      </div>

                      <div
                        className={`donor-urgency ${
                          request.urgency
                            ? request.urgency
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )
                            : ""
                        }`}
                      >
                        {request.urgency}
                      </div>

                    </div>

                    <div className="donor-blood-requirement">

                      <div className="donor-blood-circle">
                        {request.blood_group}
                      </div>

                      <div>
                        <span>
                          BLOOD REQUIRED
                        </span>

                        <strong>
                          {request.units_required}{" "}
                          {request.units_required === 1
                            ? "Unit"
                            : "Units"}
                        </strong>
                      </div>

                    </div>

                    <div className="donor-request-details">

                      <div>
                        <span>
                          📍 LOCATION
                        </span>

                        <strong>
                          {request.location}
                        </strong>
                      </div>

                      <div>
                        <span>
                          ↝ DISTANCE
                        </span>

                        <strong>
                          {request.distance_km !== null
                            ? `${request.distance_km} km`
                            : "Not available"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          ⚡ PRIORITY
                        </span>

                        <strong
                          className={
                            request.priority ===
                            "High"
                              ? "donor-high-priority"
                              : "donor-normal-priority"
                          }
                        >
                          {request.priority}
                        </strong>
                      </div>

                      <div>
                        <span>
                          ✓ COMPATIBILITY
                        </span>

                        <strong className="donor-compatible">
                          {request.compatibility}
                        </strong>
                      </div>

                    </div>

                    <div className="donor-smart-match">

                      <div className="smart-match-heading">

                        <div>
                          <span>
                            ✦ AI SMART MATCH
                          </span>

                          <small>
                            Compatibility + Distance +
                            Urgency
                          </small>
                        </div>

                        <strong>
                          {request.matching_score !==
                            undefined &&
                          request.matching_score !==
                            null
                            ? `${request.matching_score}%`
                            : "Matched"}
                        </strong>

                      </div>

                      <div className="donor-match-progress">

                        <div
                          style={{
                            width:
                              request.matching_score !==
                                undefined &&
                              request.matching_score !==
                                null
                                ? `${Math.min(
                                    request.matching_score,
                                    100
                                  )}%`
                                : "100%",
                          }}
                        ></div>

                      </div>

                    </div>

                    <div className="donor-response-area">

                      {currentResponse ? (

                        <div
                          className={`donor-response-result ${
                            currentResponse ===
                            "Accepted"
                              ? "donor-response-accepted"
                              : "donor-response-rejected"
                          }`}
                        >

                          <div className="response-result-icon">
                            {currentResponse ===
                            "Accepted"
                              ? "✓"
                              : "×"}
                          </div>

                          <div>
                            <small>
                              YOUR RESPONSE
                            </small>

                            <strong>
                              {currentResponse}
                            </strong>
                          </div>

                        </div>

                      ) : (

                        <>
                          <p>
                            Can you help with this
                            blood request?
                          </p>

                          <div className="donor-response-buttons">

                            <button
                              type="button"
                              className="donor-accept-button"
                              onClick={() =>
                                respondToRequest(
                                  request.id,
                                  "Accepted"
                                )
                              }
                            >
                              ✓ Accept Request
                            </button>

                            <button
                              type="button"
                              className="donor-reject-button"
                              onClick={() =>
                                respondToRequest(
                                  request.id,
                                  "Rejected"
                                )
                              }
                            >
                              Reject
                            </button>

                          </div>
                        </>

                      )}

                    </div>

                  </article>

                );
              })}

            </div>

          )}

        </section>

      </main>

      <footer className="donor-dashboard-footer">

        <div>
          <strong>
            BloodMatch
          </strong>

          <span>
            Intelligent blood donor & hospital matching
          </span>
        </div>

        <span>
          Medical + AI Technology
        </span>

      </footer>

    </div>
  );
}

export default DonorDashboard;