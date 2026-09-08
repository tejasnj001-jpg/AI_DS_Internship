import { useState, useEffect } from "react";

function FindDonor() {
  const [requests, setRequests] = useState([]);
  const [requestId, setRequestId] = useState("");
  const [donors, setDonors] = useState([]);
  const [bloodRequest, setBloodRequest] = useState(null);
  const [message, setMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState({});

  // Load only the logged-in hospital's blood requests
  useEffect(() => {
    const loadRequests = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        setMessage("Please login first. 🔐");
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/my-hospital-blood-requests/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          if (Array.isArray(data)) {
            setRequests(data);

            if (data.length === 0) {
              setMessage(
                "You have not created any blood requests yet."
              );
            } else {
              setMessage(
                `${data.length} blood request(s) loaded.`
              );
            }
          } else {
            setMessage(
              "Django returned an unexpected response."
            );
          }
        } else if (response.status === 401) {
          setMessage(
            "Session expired. Please login again. 🔐"
          );
        } else {
          setMessage(
            data.error ||
              "Unable to load your blood requests."
          );
        }
      } catch (error) {
        console.error(error);
        setMessage("Cannot connect to Django server.");
      }
    };

    loadRequests();
  }, []);

  // Find suitable donors
  const findDonors = async (event) => {
    event.preventDefault();

    setMessage("");
    setDonors([]);
    setBloodRequest(null);

    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setMessage("Please login first. 🔐");
      return;
    }

    if (!requestId) {
      setMessage("Please select a blood request.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/match/?request_id=${requestId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setBloodRequest(data.blood_request);
        setDonors(data.matching_donors || []);

        if (
          !data.matching_donors ||
          data.matching_donors.length === 0
        ) {
          setMessage("No suitable donors found.");
        } else {
          setMessage("Suitable donors found! 🩸");
        }
      } else if (response.status === 401) {
        setMessage(
          "Session expired. Please login again. 🔐"
        );
      } else {
        setMessage(
          data.detail ||
            "Unable to find matching donors."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to Django server.");
    }
  };

  // Accept or Reject donor
  const respondToDonor = async (donorId, status) => {
    console.log("Donor ID:", donorId);
    console.log("Status:", status);
    console.log("Request ID:", requestId);

    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setMessage("Please login first. 🔐");
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
            blood_request: Number(requestId),
            donor: donorId,
            status: status,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Donor Response API:",
        JSON.stringify(data, null, 2)
      );

      if (response.ok) {
        setResponseStatus((previous) => ({
          ...previous,
          [donorId]: status,
        }));

        setMessage(
          `Donor ${status.toLowerCase()} successfully! 🩸`
        );
      } else if (response.status === 401) {
        setMessage(
          "Session expired. Please login again. 🔐"
        );
      } else {
        setMessage(
          data.error ||
            "Unable to save donor response."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to Django server.");
    }
  };

  return (
    <div className="find-donor-page">

      {/* ================= HERO ================= */}

      <header className="find-donor-hero">
        <div className="find-donor-hero-content">

          <div>
            <span className="find-donor-badge">
              ✦ AI • HEALTHCARE • SMART MATCHING
            </span>

            <h1>
              Find the right
              <br />
              <span>blood donor.</span>
            </h1>

            <p>
              Discover compatible donors using blood-group
              compatibility, location, priority and AI-powered
              matching.
            </p>
          </div>

          <div className="find-donor-hero-visual">
            <div className="find-donor-hero-icon">
              🩸
            </div>

            <div className="find-donor-ai-bubble">
              ✦ AI
            </div>
          </div>

        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="find-donor-container">

        {/* Message */}

        {message && (
          <div className="find-donor-message">
            <span>✓</span>
            {message}
          </div>
        )}

        {/* ================= SEARCH PANEL ================= */}

        <section className="find-donor-search-section">

          <div className="find-donor-section-heading">
            <div>
              <span className="find-donor-section-label">
                DONOR DISCOVERY
              </span>

              <h2>Find Compatible Donors</h2>

              <p>
                Select one of your hospital's blood requests
                to start intelligent donor matching.
              </p>
            </div>

            <div className="find-donor-request-counter">
              <strong>{requests.length}</strong>
              <span>Your Requests</span>
            </div>
          </div>

          <form
            className="find-donor-search-card"
            onSubmit={findDonors}
          >

            <div className="find-donor-search-icon">
              🔎
            </div>

            <div className="find-donor-select-area">

              <label htmlFor="blood-request">
                SELECT BLOOD REQUEST
              </label>

              <select
                id="blood-request"
                value={requestId}
                onChange={(event) =>
                  setRequestId(event.target.value)
                }
                required
              >
                <option value="">
                  Select Your Blood Request
                </option>

                {requests.map((request) => (
                  <option
                    key={request.id}
                    value={request.id}
                  >
                    Request #{request.id} -{" "}
                    {request.hospital_name} -{" "}
                    {request.blood_group} -{" "}
                    {request.units_required} units -{" "}
                    {request.urgency}
                  </option>
                ))}
              </select>

            </div>

            <button
              type="submit"
              className="find-donor-search-button"
            >
              Find Donors
              <span>→</span>
            </button>

          </form>

        </section>

        {/* ================= BLOOD REQUEST ================= */}

        {bloodRequest && (
          <section className="find-donor-request-section">

            <div className="find-donor-section-heading">
              <div>
                <span className="find-donor-section-label">
                  ACTIVE BLOOD REQUEST
                </span>

                <h2>Request Details</h2>

                <p>
                  The selected request being used for donor
                  matching.
                </p>
              </div>

              <div className="find-donor-active-blood">
                {bloodRequest.blood_group}
              </div>
            </div>

            <div className="find-donor-request-summary">

              <div className="find-donor-request-main">
                <span>REQUEST #{bloodRequest.id}</span>

                <h3>
                  {bloodRequest.hospital_name}
                </h3>

                <p>
                  📍 {bloodRequest.location}
                </p>
              </div>

              <div className="find-donor-summary-item">
                <span>Blood Group</span>
                <strong className="find-donor-blood-text">
                  {bloodRequest.blood_group}
                </strong>
              </div>

              <div className="find-donor-summary-item">
                <span>Units Required</span>
                <strong>
                  {bloodRequest.units_required}
                </strong>
              </div>

              <div className="find-donor-summary-item">
                <span>Urgency</span>
                <strong className="find-donor-urgency">
                  {bloodRequest.urgency}
                </strong>
              </div>

            </div>

          </section>
        )}

        {/* ================= MATCHING RESULTS ================= */}

        <section className="find-donor-results-section">

          <div className="find-donor-section-heading">
            <div>
              <span className="find-donor-section-label">
                INTELLIGENT MATCH RESULTS
              </span>

              <h2>Matching Donors</h2>

              <p>
                Donors ranked using compatibility, distance,
                priority and AI matching score.
              </p>
            </div>

            {donors.length > 0 && (
              <div className="find-donor-match-count">
                <strong>{donors.length}</strong>
                <span>Matches</span>
              </div>
            )}
          </div>

          {donors.length === 0 && bloodRequest && (
            <div className="find-donor-empty">
              <div className="find-donor-empty-icon">
                🩸
              </div>

              <h3>No suitable donors found</h3>

              <p>
                No compatible donors are currently available
                for this request.
              </p>
            </div>
          )}

          {donors.length > 0 && (
            <div className="find-donor-grid">

              {donors.map((donor, index) => {

                const currentResponse =
                  responseStatus[donor.id];

                return (
                  <article
                    className="find-donor-card"
                    key={donor.id || index}
                  >

                    {/* Donor Header */}

                    <div className="find-donor-card-header">

                      <div className="find-donor-avatar">
                        {donor.name
                          ? donor.name
                              .charAt(0)
                              .toUpperCase()
                          : "D"}
                      </div>

                      <div className="find-donor-name">
                        <span>MATCHED DONOR</span>

                        <h3>
                          {donor.name}
                        </h3>
                      </div>

                      <div
                        className={`find-donor-priority ${
                          donor.priority
                            ? donor.priority
                                .toLowerCase()
                                .replace(/\s+/g, "-")
                            : ""
                        }`}
                      >
                        {donor.priority}
                      </div>

                    </div>

                    {/* AI Score */}

                    <div className="find-donor-ai-score">

                      <div className="find-donor-score-top">

                        <div>
                          <span>✦ AI MATCH SCORE</span>

                          <strong>
                            {donor.matching_score !==
                              undefined &&
                            donor.matching_score !== null
                              ? `${donor.matching_score}%`
                              : "Matched"}
                          </strong>
                        </div>

                        <div className="find-donor-score-icon">
                          ✦
                        </div>

                      </div>

                      <div className="find-donor-score-bar">
                        <div
                          style={{
                            width:
                              donor.matching_score !==
                                undefined &&
                              donor.matching_score !== null
                                ? `${Math.min(
                                    donor.matching_score,
                                    100
                                  )}%`
                                : "100%",
                          }}
                        ></div>
                      </div>

                    </div>

                    {/* Donor Details */}

                    <div className="find-donor-details">

                      <div>
                        <span>Blood Group</span>

                        <strong className="find-donor-blood-text">
                          {donor.blood_group}
                        </strong>
                      </div>

                      <div>
                        <span>Distance</span>

                        <strong>
                          {donor.distance_km} km
                        </strong>
                      </div>

                      <div>
                        <span>Location</span>

                        <strong>
                          📍 {donor.location}
                        </strong>
                      </div>

                      <div>
                        <span>Compatibility</span>

                        <strong className="find-donor-compatible">
                          ✓ {donor.compatibility}
                        </strong>
                      </div>

                      <div>
                        <span>Phone</span>

                        <strong>
                          {donor.phone}
                        </strong>
                      </div>

                    </div>

                    {/* AI Information */}

                    {(donor.ai_prediction ||
                      donor.ai_confidence) && (

                      <div className="find-donor-ai-info">

                        <div className="find-donor-ai-title">
                          <span>✦</span>
                          <strong>
                            AI Prediction
                          </strong>
                        </div>

                        {donor.ai_prediction && (
                          <p>
                            {donor.ai_prediction}
                          </p>
                        )}

                        {donor.ai_confidence && (
                          <small>
                            Confidence:{" "}
                            {donor.ai_confidence}
                          </small>
                        )}

                      </div>

                    )}

                    {/* Response */}

                    <div className="find-donor-response">

                      {currentResponse ? (

                        <div
                          className={`find-donor-response-status ${
                            currentResponse ===
                            "Accepted"
                              ? "accepted"
                              : "rejected"
                          }`}
                        >
                          <span>
                            {currentResponse ===
                            "Accepted"
                              ? "✓"
                              : "×"}
                          </span>

                          <div>
                            <small>
                              HOSPITAL RESPONSE
                            </small>

                            <strong>
                              {currentResponse}
                            </strong>
                          </div>
                        </div>

                      ) : (

                        <div>
                          <p>
                            Would you like to respond to
                            this donor?
                          </p>

                          <div className="find-donor-response-buttons">

                            <button
                              type="button"
                              className="find-donor-accept"
                              onClick={() =>
                                respondToDonor(
                                  donor.id,
                                  "Accepted"
                                )
                              }
                            >
                              ✓ Accept Donor
                            </button>

                            <button
                              type="button"
                              className="find-donor-reject"
                              onClick={() =>
                                respondToDonor(
                                  donor.id,
                                  "Rejected"
                                )
                              }
                            >
                              Reject
                            </button>

                          </div>
                        </div>

                      )}

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        </section>

      </main>

      {/* ================= FOOTER ================= */}

      <footer className="find-donor-footer">

        <div>
          <strong>BloodMatch</strong>

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

export default FindDonor;