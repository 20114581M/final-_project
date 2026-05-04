import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroBg from "../src/assets/hero.jpg";

type Mode = "login" | "register";

export default function Login() {
  const [mode, setMode] = useState<Mode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");

    if (mode === "register") {
      if (!fullName || !email || !password || !confirmPassword) {
        return setError("Please fill in all fields.");
      }
      if (password !== confirmPassword) {
        return setError("Passwords do not match.");
      }
    } else {
      if (!email || !password) {
        return setError("Please fill in all fields.");
      }
    }

    setLoading(true);

    try {
      const endpoint = mode === "login"
        ? "http://localhost:5000/login"
        : "http://localhost:5000/register";

      const body = mode === "login"
        ? { email, password }
        : { fullName, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      // Save token + user info to sessionStorage
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", minHeight: "100vh", background: "#0a1a0a", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fauna+One&family=Cinzel:wght@700;900&family=Jost:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --primary: #13e513;
          --accent: #d4ed17;
          --primary-dim: rgba(19, 229, 19, 0.12);
          --primary-border: rgba(19, 229, 19, 0.35);
        }

        .lg-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 32px;
          background: rgba(5, 12, 5, 0.9);
          backdrop-filter: blur(14px);
          border-bottom: 0.5px solid rgba(19, 229, 19, 0.2);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .lg-logo-wrap {
          display: flex;
          align-items: center;
          gap: 11px;
          cursor: pointer;
        }

        .lg-logo-icon {
          width: 36px;
          height: 36px;
          background: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .lg-logo-name {
          font-family: 'Cinzel', serif;
          font-weight: 700;
          font-size: 15px;
          color: #ffffff;
          letter-spacing: 0.04em;
          line-height: 1.2;
        }

        .lg-logo-sub {
          font-size: 10px;
          color: var(--primary);
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .lg-back {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.55);
          background: transparent;
          border: none;
          cursor: pointer;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 7px 14px;
          border-radius: 6px;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }

        .lg-back:hover {
          background: rgba(19,229,19,0.08);
          color: #ffffff;
        }

        .lg-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 20px;
          position: relative;
          overflow: hidden;
        }

        .lg-hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .lg-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(5, 14, 5, 0.72) 0%,
            rgba(5, 14, 5, 0.6) 50%,
            rgba(5, 14, 5, 0.82) 100%
          );
        }

        .lg-bg-decor {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 1;
        }

        .lg-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 420px;
          background: rgba(10, 22, 10, 0.92);
          border: 0.5px solid rgba(19, 229, 19, 0.2);
          border-radius: 16px;
          padding: 40px 36px;
          backdrop-filter: blur(12px);
        }

        .lg-toggle {
          display: flex;
          background: rgba(19, 229, 19, 0.08);
          border: 0.5px solid rgba(19, 229, 19, 0.2);
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 32px;
          gap: 4px;
        }

        .lg-toggle-btn {
          flex: 1;
          padding: 9px 0;
          border: none;
          border-radius: 7px;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          background: transparent;
          color: rgba(255,255,255,0.45);
        }

        .lg-toggle-btn.active {
          background: var(--primary);
          color: #050f05;
        }

        .lg-heading {
          font-family: 'Cinzel', serif;
          font-weight: 900;
          font-size: 28px;
          color: #ffffff;
          letter-spacing: 0.02em;
          margin-bottom: 6px;
          line-height: 1.1;
        }

        .lg-heading span { color: var(--accent); }

        .lg-subheading {
          font-family: 'Fauna One', serif;
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 28px;
          line-height: 1.6;
        }

        .lg-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .lg-label {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.55);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .lg-input {
          padding: 12px 14px;
          background: rgba(19, 229, 19, 0.05);
          border: 0.5px solid rgba(19, 229, 19, 0.25);
          border-radius: 8px;
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          color: #ffffff;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
          width: 100%;
        }

        .lg-input::placeholder { color: rgba(255,255,255,0.25); }

        .lg-input:focus {
          border-color: var(--primary);
          background: rgba(19, 229, 19, 0.08);
        }

        .lg-error {
          background: rgba(220, 60, 60, 0.12);
          border: 0.5px solid rgba(220, 60, 60, 0.35);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #ff8a8a;
          margin-bottom: 4px;
          font-family: 'Jost', sans-serif;
        }

        .lg-submit {
          width: 100%;
          padding: 14px;
          background: var(--primary);
          color: #050f05;
          border: none;
          border-radius: 8px;
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 24px;
          transition: background 0.15s, transform 0.1s, opacity 0.15s;
        }

        .lg-submit:hover:not(:disabled) { background: #0ecf0e; transform: translateY(-1px); }
        .lg-submit:active:not(:disabled) { transform: scale(0.98); }
        .lg-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        .lg-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
        }

        .lg-divider-line {
          flex: 1;
          height: 0.5px;
          background: rgba(255,255,255,0.1);
        }

        .lg-divider-text {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .lg-switch {
          text-align: center;
          font-family: 'Fauna One', serif;
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          margin-top: 20px;
        }

        .lg-switch button {
          background: none;
          border: none;
          color: var(--primary);
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          letter-spacing: 0.02em;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .lg-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px 32px;
          border-top: 0.5px solid rgba(19, 229, 19, 0.15);
          background: rgba(5, 12, 5, 0.9);
        }

        .lg-footer-text {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.03em;
        }

        @media (max-width: 768px) {
          .lg-nav { padding: 12px 16px; }
          .lg-main { padding: 24px 16px; align-items: flex-start; padding-top: 32px; }
          .lg-card { padding: 28px 20px; border-radius: 14px; }
          .lg-heading { font-size: 24px; }
        }

        @media (max-width: 480px) {
          .lg-logo-name, .lg-logo-sub { display: none; }
          .lg-back { font-size: 12px; padding: 6px 10px; }
          .lg-card { padding: 24px 16px; }
          .lg-heading { font-size: 22px; }
          .lg-subheading { font-size: 13px; margin-bottom: 22px; }
          .lg-input { font-size: 16px; }
          .lg-footer { padding: 12px 16px; }
        }
      `}</style>

      <header className="lg-nav">
        <div className="lg-logo-wrap" onClick={() => navigate("/")}>
          <div className="lg-logo-icon">
            <svg width="16" height="18" viewBox="0 0 20 22" fill="none">
              <polygon points="10,1 17,9 13,9 17,15 12.5,15 12.5,21 7.5,21 7.5,15 3,15 7,9 3,9" fill="#050f05" opacity="0.95" />
            </svg>
          </div>
          <div>
            <div className="lg-logo-name">Baguio City Hub</div>
            <div className="lg-logo-sub">City Issue Portal</div>
          </div>
        </div>
        <button className="lg-back" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </header>

      <main className="lg-main">
        <div className="lg-hero-bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="lg-hero-overlay" />

        <div className="lg-bg-decor">
          <svg width="100%" height="100%" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.07" fill="#3a6b3a">
              <polygon points="60,600 100,480 140,600" />
              <polygon points="40,620 100,420 160,620" />
              <polygon points="20,640 100,350 180,640" />
              <polygon points="1060,600 1100,480 1140,600" />
              <polygon points="1040,620 1100,420 1160,620" />
              <polygon points="1020,640 1100,350 1180,640" />
            </g>
            <g opacity="0.04" fill="none" stroke="#13e513" strokeWidth="0.5">
              <circle cx="600" cy="350" r="120" />
              <circle cx="600" cy="350" r="220" />
            </g>
          </svg>
        </div>

        <div className="lg-card">
          <div className="lg-toggle">
            <button
              className={`lg-toggle-btn${mode === "login" ? " active" : ""}`}
              onClick={() => { setMode("login"); setError(""); }}
            >
              Login
            </button>
            <button
              className={`lg-toggle-btn${mode === "register" ? " active" : ""}`}
              onClick={() => { setMode("register"); setError(""); }}
            >
              Register
            </button>
          </div>

          {mode === "login" ? (
            <>
              <h1 className="lg-heading">Welcome <span>back</span></h1>
              <p className="lg-subheading">Sign in to report and track city issues.</p>
            </>
          ) : (
            <>
              <h1 className="lg-heading">Join the <span>hub</span></h1>
              <p className="lg-subheading">Create an account and start making a difference.</p>
            </>
          )}

          {mode === "register" && (
            <div className="lg-field">
              <label className="lg-label">Full name</label>
              <input
                className="lg-input"
                type="text"
                placeholder="Juan dela Cruz"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div className="lg-field">
            <label className="lg-label">Email address</label>
            <input
              className="lg-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="lg-field">
            <label className="lg-label">Password</label>
            <input
              className="lg-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {mode === "register" && (
            <div className="lg-field">
              <label className="lg-label">Confirm password</label>
              <input
                className="lg-input"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          {error && <div className="lg-error">{error}</div>}

          <button
            className="lg-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>

          <div className="lg-divider">
            <div className="lg-divider-line" />
            <span className="lg-divider-text">or</span>
            <div className="lg-divider-line" />
          </div>

          <p className="lg-switch">
            {mode === "login" ? (
              <>Don't have an account?{" "}
                <button onClick={() => { setMode("register"); setError(""); }}>Register here</button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => { setMode("login"); setError(""); }}>Sign in</button>
              </>
            )}
          </p>
        </div>
      </main>

      <footer className="lg-footer">
        <p className="lg-footer-text">
          © {new Date().getFullYear()} Baguio City Hub. All rights reserved.
        </p>
      </footer>
    </div>
  );
}