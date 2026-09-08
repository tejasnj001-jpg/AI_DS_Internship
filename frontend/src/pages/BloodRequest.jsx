import { useState } from "react";

function BloodRequest() {
  const [formData, setFormData] = useState({
    blood_group: "",
    units_required: "",
    urgency: "",
  });

  const [message, setMessage] = useState("");
  const [requestId, setRequestId] = useState(null);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setRequestId(null);

    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setMessage("Please login first. 🔐");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/blood-requests/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            blood_group: formData.blood_group,
            units_required: Number(formData.units_required),
            urgency: formData.urgency,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Blood request created successfully! 🩸"
        );

        setRequestId(data.id);

        setFormData({
          blood_group: "",
          units_required: "",
          urgency: "",
        });
      } else if (response.status === 401) {
        setMessage(
          "Session expired. Please login again. 🔐"
        );
      } else {
        setMessage(
          data.detail ||
            data.error ||
            "Failed to create blood request."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "Cannot connect to Django server."
      );
    }
  };

  return (
    <div className="blood-request-page">

      {/* ================= HERO ================= */}

      <section className="blood-request-hero">
        <div className="blood-request-hero-content">

          <div>
            <span className="blood-request-badge">
              ✦ AI • HEALTHCARE • BLOOD MANAGEMENT
            </span>

            <h1>
              Create a blood
              <br />
              <span>request.</span>
            </h1>

            <p>
              Submit your hospital's blood requirement and
              let BloodMatch intelligently connect you with
              compatible donors.
            </p>
          </div>

          <div className="blood-request-hero-visual">
            <div className="blood-request-hero-icon">
              🩸
            </div>

            <div className="blood-request-ai-badge">
              ✦ AI
            </div>
          </div>

        </div>
      </section>

      {/* ================= MAIN ================= */}

      <main className="blood-request-container">

        {/* Information Strip */}

        <div className="blood-request-info-strip">

          <div className="blood-request-info-icon">
            🏥
          </div>

          <div>
            <strong>Hospital Blood Request</strong>
            <p>
              Provide the required blood group, quantity and
              urgency to begin donor matching.
            </p>
          </div>

        </div>

        {/* ================= FORM SECTION ================= */}

        <section className="blood-request-section">

          <div className="blood-request-section-heading">

            <div>
              <span className="blood-request-section-label">
                REQUEST DETAILS
              </span>

              <h2>Create Blood Request</h2>

              <p>
                Enter the blood requirement for your hospital.
              </p>
            </div>

            <div className="blood-request-secure">
              <span>✓</span>
              Secure Hospital Portal
            </div>

          </div>

          <div className="blood-request-layout">

            {/* Form */}

            <form
              className="blood-request-form-card"
              onSubmit={handleSubmit}
            >

              {/* Blood Group */}

              <div className="blood-request-form-group">

                <label htmlFor="blood_group">
                  BLOOD GROUP
                </label>

                <div className="blood-request-input-wrapper">
                  <span>🩸</span>

                  <select
                    id="blood_group"
                    name="blood_group"
                    value={formData.blood_group}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Blood Group
                    </option>

                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

              </div>

              {/* Units */}

              <div className="blood-request-form-group">

                <label htmlFor="units_required">
                  UNITS REQUIRED
                </label>

                <div className="blood-request-input-wrapper">
                  <span>📦</span>

                  <input
                    id="units_required"
                    type="number"
                    name="units_required"
                    placeholder="Enter number of units"
                    min="1"
                    value={formData.units_required}
                    onChange={handleChange}
                    required
                  />
                </div>

                <small>
                  Enter the number of blood units required.
                </small>

              </div>

              {/* Urgency */}

              <div className="blood-request-form-group">

                <label htmlFor="urgency">
                  URGENCY LEVEL
                </label>

                <div className="blood-request-input-wrapper">
                  <span>⚡</span>

                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Urgency
                    </option>

                    <option value="Emergency">
                      Emergency
                    </option>

                    <option value="Critical">
                      Critical
                    </option>

                    <option value="High">
                      High
                    </option>

                    <option value="Medium">
                      Medium
                    </option>
                  </select>
                </div>

                <small>
                  Choose the urgency based on the patient's
                  requirement.
                </small>

              </div>

              {/* Submit */}

              <button
                type="submit"
                className="blood-request-submit"
              >
                <span>🩸</span>
                Create Blood Request
                <strong>→</strong>
              </button>

            </form>

            {/* AI Information Card */}

            <aside className="blood-request-ai-card">

              <div className="blood-request-ai-icon">
                ✦
              </div>

              <span className="blood-request-ai-label">
                INTELLIGENT MATCHING
              </span>

              <h3>
                What happens next?
              </h3>

              <p>
                Once your request is created, BloodMatch can
                identify suitable donors using multiple
                intelligent matching factors.
              </p>

              <div className="blood-request-ai-features">

                <div>
                  <span>01</span>
                  <div>
                    <strong>Compatibility</strong>
                    <small>
                      Blood group matching
                    </small>
                  </div>
                </div>

                <div>
                  <span>02</span>
                  <div>
                    <strong>Distance</strong>
                    <small>
                      Location-based matching
                    </small>
                  </div>
                </div>

                <div>
                  <span>03</span>
                  <div>
                    <strong>Urgency</strong>
                    <small>
                      Priority-aware matching
                    </small>
                  </div>
                </div>

                <div>
                  <span>04</span>
                  <div>
                    <strong>AI Prediction</strong>
                    <small>
                      Smart donor ranking
                    </small>
                  </div>
                </div>

              </div>

            </aside>

          </div>

        </section>

        {/* ================= RESULT ================= */}

        {message && (
          <section className="blood-request-result">

            <div className="blood-request-result-icon">
              {requestId ? "✓" : "!"}
            </div>

            <div>
              <span>
                {requestId
                  ? "REQUEST CREATED"
                  : "SYSTEM MESSAGE"}
              </span>

              <h3>{message}</h3>

              {requestId && (
                <p>
                  Blood Request ID:{" "}
                  <strong>#{requestId}</strong>
                </p>
              )}
            </div>

          </section>
        )}

      </main>

      {/* ================= FOOTER ================= */}

      <footer className="blood-request-footer">

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

export default BloodRequest;