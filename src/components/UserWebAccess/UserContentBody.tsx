"use client";
import { useState } from "react";

const API_BASE = "http://localhost:5000";

type Status = "loading" | "success" | "error" | null;

export default function UserContentBody() {
  const [form, setForm] = useState({
    category: "",
    urgency: "",
    title: "",
    location: "",
    description: "",
  });

  const [status, setStatus] = useState<Status>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setStatus("loading");
    setErrorMsg("");

    const token = sessionStorage.getItem("token");
    if (!token) {
      setStatus("error");
      setErrorMsg("You must be logged in to submit a report.");
      return;
    }

    const { category, urgency, title, location, description } = form;
    if (!category || !urgency || !title || !location || !description) {
      setStatus("error");
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category, urgency, title, location, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");

      setTrackingNumber(data.trackingNumber);
      setStatus("success");
      setForm({ category: "", urgency: "", title: "", location: "", description: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.");
    }
  };

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", minHeight: "100vh", background: "#0a1a0a", color: "#ffffff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fauna+One&family=Cinzel:wght@700;900&family=Jost:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --primary: #13e513; --accent: #d4ed17; --primary-dim: rgba(19,229,19,0.1); --primary-border: rgba(19,229,19,0.3); }

        .ucb-main { max-width: 720px; margin: 0 auto; padding: 48px 24px; }

        .ucb-page-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--primary); margin-bottom: 8px;
        }

        .ucb-heading {
          font-family: 'Cinzel', serif; font-weight: 900;
          font-size: 32px; color: #ffffff; letter-spacing: 0.02em;
          margin-bottom: 8px; line-height: 1.15;
        }

        .ucb-heading span { color: var(--accent); }

        .ucb-subheading {
          font-family: 'Fauna One', serif; font-size: 15px;
          color: rgba(255,255,255,0.5); line-height: 1.7; margin-bottom: 36px;
        }

        .ucb-card {
          background: rgba(10, 22, 10, 0.85);
          border: 0.5px solid rgba(19, 229, 19, 0.18);
          border-radius: 16px;
          padding: 36px 32px;
        }

        .ucb-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }

        .ucb-label {
          font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.5); letter-spacing: 0.08em; text-transform: uppercase;
        }

        .ucb-input, .ucb-select, .ucb-textarea {
          padding: 12px 14px;
          background: rgba(19, 229, 19, 0.05);
          border: 0.5px solid rgba(19, 229, 19, 0.22);
          border-radius: 8px;
          font-family: 'Jost', sans-serif;
          font-size: 14px; color: #ffffff; outline: none;
          transition: border-color 0.15s, background 0.15s;
          width: 100%;
        }

        .ucb-input::placeholder, .ucb-textarea::placeholder { color: rgba(255,255,255,0.22); }
        .ucb-input:focus, .ucb-select:focus, .ucb-textarea:focus {
          border-color: var(--primary);
          background: rgba(19, 229, 19, 0.08);
        }

        .ucb-select option { background: #0a1a0a; color: #ffffff; }
        .ucb-textarea { resize: vertical; min-height: 110px; }
        .ucb-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .ucb-submit {
          width: 100%; padding: 14px;
          background: var(--primary); color: #050f05;
          border: none; border-radius: 8px;
          font-family: 'Jost', sans-serif; font-size: 14px;
          font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; cursor: pointer;
          margin-top: 8px;
          transition: background 0.15s, transform 0.1s;
        }

        .ucb-submit:hover:not(:disabled) { background: #0ecf0e; transform: translateY(-1px); }
        .ucb-submit:active:not(:disabled) { transform: scale(0.98); }
        .ucb-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .ucb-note {
          display: flex; align-items: flex-start; gap: 10px;
          background: rgba(212, 237, 23, 0.07);
          border: 0.5px solid rgba(212, 237, 23, 0.22);
          border-radius: 8px; padding: 12px 14px;
          font-size: 12px; color: rgba(212, 237, 23, 0.75);
          line-height: 1.6; margin-bottom: 20px;
        }

        .ucb-success {
          background: rgba(19, 229, 19, 0.08);
          border: 0.5px solid rgba(19, 229, 19, 0.4);
          border-radius: 10px; padding: 20px 24px;
          text-align: center;
        }
        .ucb-success-icon { font-size: 32px; margin-bottom: 10px; }
        .ucb-success-title {
          font-family: 'Cinzel', serif; font-size: 18px;
          color: var(--primary); margin-bottom: 6px;
        }
        .ucb-success-sub { font-size: 13px; color: rgba(255,255,255,0.55); margin-bottom: 12px; }
        .ucb-tracking {
          display: inline-block; font-size: 13px; font-weight: 700;
          letter-spacing: 0.1em; color: var(--accent);
          background: rgba(212, 237, 23, 0.08);
          border: 0.5px solid rgba(212, 237, 23, 0.3);
          border-radius: 6px; padding: 6px 14px;
        }
        .ucb-new-report {
          margin-top: 16px; background: transparent;
          border: 0.5px solid rgba(19, 229, 19, 0.3);
          border-radius: 8px; color: var(--primary);
          font-family: 'Jost', sans-serif; font-size: 13px;
          font-weight: 600; padding: 10px 20px; cursor: pointer;
          transition: background 0.15s;
        }
        .ucb-new-report:hover { background: rgba(19,229,19,0.08); }

        .ucb-error {
          background: rgba(229, 57, 19, 0.08);
          border: 0.5px solid rgba(229, 57, 19, 0.3);
          border-radius: 8px; padding: 10px 14px;
          font-size: 12px; color: rgba(255, 120, 80, 0.9);
          margin-bottom: 12px;
        }

        @media (max-width: 600px) {
          .ucb-card { padding: 24px 16px; }
          .ucb-heading { font-size: 24px; }
          .ucb-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <main className="ucb-main">
        <p className="ucb-page-label">Citizen Portal</p>
        <h1 className="ucb-heading">Report an <span>Issue</span></h1>
        <p className="ucb-subheading">
          Help keep Baguio City clean and safe. Fill out the form below and your
          report will be forwarded to the appropriate city department.
        </p>

        <div className="ucb-card">
          {status === "success" ? (
            <div className="ucb-success">
              <div className="ucb-success-icon">✅</div>
              <p className="ucb-success-title">Report Submitted</p>
              <p className="ucb-success-sub">Your report has been logged. Keep your tracking number for follow-ups.</p>
              <span className="ucb-tracking">{trackingNumber}</span>
              <br />
              <button className="ucb-new-report" onClick={() => setStatus(null)}>
                Submit another report
              </button>
            </div>
          ) : (
            <>
              <div className="ucb-note">
                ⚠ All fields are required. You will receive a tracking number once your report is submitted.
              </div>

              {status === "error" && (
                <div className="ucb-error">⚠ {errorMsg}</div>
              )}

              <div className="ucb-row">
                <div className="ucb-field">
                  <label className="ucb-label">Issue Category</label>
                  <select
                    className="ucb-select"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="">Select category</option>
                    <option>Road &amp; Infrastructure</option>
                    <option>Garbage &amp; Sanitation</option>
                    <option>Flooding &amp; Drainage</option>
                    <option>Street Lighting</option>
                    <option>Public Safety</option>
                    <option>Parks &amp; Public Spaces</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="ucb-field">
                  <label className="ucb-label">Urgency Level</label>
                  <select
                    className="ucb-select"
                    name="urgency"
                    value={form.urgency}
                    onChange={handleChange}
                  >
                    <option value="">Select urgency</option>
                    <option>Low — can wait</option>
                    <option>Medium — needs attention</option>
                    <option>High — urgent</option>
                    <option>Critical — immediate danger</option>
                  </select>
                </div>
              </div>

              <div className="ucb-field">
                <label className="ucb-label">Issue Title</label>
                <input
                  className="ucb-input"
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Large pothole on Marcos Highway near SM"
                />
              </div>

              <div className="ucb-field">
                <label className="ucb-label">Location / Address</label>
                <input
                  className="ucb-input"
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Marcos Highway, near SM Baguio"
                />
              </div>

              <div className="ucb-field">
                <label className="ucb-label">Description</label>
                <textarea
                  className="ucb-textarea"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the issue in detail. Include any relevant information that may help resolve it faster."
                />
              </div>

              <button
                className="ucb-submit"
                onClick={handleSubmit}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Submitting…" : "Submit Report"}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}