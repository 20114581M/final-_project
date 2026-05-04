import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from "./Home";
import ContactUS from "./contactUS";
import heroBg from "../../assets/hero.jpg";

type Tab = "Home" | "Contact Us" | "Login / Register";

const tabs: Tab[] = ["Home", "Contact Us", "Login / Register"];

export default function MarketingHero() {
  const homeRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Check sessionStorage on mount
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");
    if (token && user) {
      setIsLoggedIn(true);
      const parsed = JSON.parse(user);
      setUserRole(parsed.role);
    }
  }, []);

  const handleDashboardClick = () => {
    if (userRole === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/user-dashboard");
    }
  };

  const handleTabClick = (tab: Tab) => {
    setMenuOpen(false);
    if (tab === "Home") {
      homeRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (tab === "Contact Us") {
      contactRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (tab === "Login / Register") {
      if (isLoggedIn) {
        handleDashboardClick();
      } else {
        navigate("/login");
      }
    }
  };

  // Label shown in nav / footer for the last tab
  const authLabel = isLoggedIn ? "Go to Dashboard →" : "Login / Register";

  return (
    <div style={{ fontFamily: "'Fauna One', serif", background: "#0a1a0a", color: "#ffffff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fauna+One&family=Cinzel:wght@700;900&family=Jost:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --primary: #13e513;
          --accent: #d4ed17;
          --primary-dim: rgba(19, 229, 19, 0.18);
          --primary-border: rgba(19, 229, 19, 0.4);
          --accent-dim: rgba(212, 237, 23, 0.15);
        }

        .bch-sticky-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 32px;
          background: rgba(5, 12, 5, 0.92);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 0.5px solid rgba(19, 229, 19, 0.2);
        }

        .bch-logo-wrap {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .bch-logo-icon {
          width: 36px;
          height: 36px;
          background: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .bch-logo-name {
          font-family: 'Cinzel', serif;
          font-weight: 700;
          font-size: 15px;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: 0.04em;
        }

        .bch-logo-sub {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          color: var(--primary);
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .bch-tabs {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .bch-tab {
          padding: 7px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          letter-spacing: 0.04em;
          border: none;
          background: transparent;
          font-family: 'Jost', sans-serif;
          transition: background 0.15s, color 0.15s;
          text-transform: uppercase;
        }

        .bch-tab:hover {
          background: rgba(19, 229, 19, 0.1);
          color: #ffffff;
        }

        .bch-tab.login {
          border: 1px solid var(--primary-border);
          color: var(--primary);
          margin-left: 10px;
          font-weight: 600;
        }

        .bch-tab.login:hover {
          background: var(--primary);
          color: #050f05;
        }

        /* ── Hamburger ── */
        .bch-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 36px;
          height: 36px;
          background: transparent;
          border: 1px solid rgba(19, 229, 19, 0.3);
          border-radius: 8px;
          cursor: pointer;
          padding: 8px;
        }

        .bch-hamburger span {
          display: block;
          width: 100%;
          height: 1.5px;
          background: var(--primary);
          border-radius: 2px;
          transition: transform 0.2s, opacity 0.2s;
        }

        .bch-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .bch-hamburger.open span:nth-child(2) { opacity: 0; }
        .bch-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── Mobile menu drawer ── */
        .bch-mobile-menu {
          display: none;
          position: fixed;
          top: 65px;
          left: 0;
          right: 0;
          z-index: 99;
          background: rgba(5, 12, 5, 0.97);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 0.5px solid rgba(19, 229, 19, 0.2);
          padding: 12px 16px 16px;
          flex-direction: column;
          gap: 4px;
        }

        .bch-mobile-menu.open {
          display: flex;
        }

        .bch-mobile-tab {
          padding: 12px 16px;
          border-radius: 8px;
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.8);
          cursor: pointer;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border: none;
          background: transparent;
          text-align: left;
          width: 100%;
          transition: background 0.15s, color 0.15s;
        }

        .bch-mobile-tab:hover {
          background: rgba(19, 229, 19, 0.1);
          color: #ffffff;
        }

        .bch-mobile-tab.login {
          border: 1px solid var(--primary-border);
          color: var(--primary);
          font-weight: 600;
          margin-top: 4px;
        }

        .bch-mobile-tab.login:hover {
          background: var(--primary);
          color: #050f05;
        }

        /* ── Hero ── */
        .bch-hero {
          position: relative;
          overflow: hidden;
          min-height: 92vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .bch-hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .bch-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(5, 14, 5, 0.52) 0%,
            rgba(5, 14, 5, 0.3) 40%,
            rgba(5, 14, 5, 0.75) 100%
          );
        }

        .bch-hero-body {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 32px;
          text-align: center;
          width: 100%;
        }

        .bch-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: var(--primary-dim);
          border: 1px solid var(--primary-border);
          border-radius: 99px;
          padding: 6px 16px;
          margin-bottom: 26px;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: "#FFFFFF";
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .bch-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--primary);
          animation: bch-pulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes bch-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.75); }
        }

        .bch-headline {
          font-family: 'Cinzel', serif;
          font-weight: 900;
          font-size: 54px;
          line-height: 1.08;
          color: #ffffff;
          margin: 0 0 18px;
          max-width: 640px;
          letter-spacing: 0.01em;
          text-shadow: 0 2px 24px rgba(0,0,0,0.5);
        }

        .bch-headline span { color: var(--accent); }

        .bch-sub {
          font-family: 'Fauna One', serif;
          font-size: 17px;
          color: rgba(255, 255, 255, 0.78);
          max-width: 460px;
          line-height: 1.7;
          margin: 0 0 38px;
          text-shadow: 0 1px 8px rgba(0,0,0,0.4);
        }

        .bch-cta-row {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .bch-btn-primary {
          padding: 14px 32px;
          background: var(--primary);
          color: #050f05;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Jost', sans-serif;
          cursor: pointer;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: background 0.15s, transform 0.1s;
        }

        .bch-btn-primary:hover {
          background: #0ecf0e;
          transform: translateY(-2px);
        }

        .bch-btn-primary:active { transform: scale(0.98); }

        .bch-btn-secondary {
          padding: 14px 32px;
          background: transparent;
          color: var(--accent);
          border: 1px solid rgba(212, 237, 23, 0.45);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Jost', sans-serif;
          cursor: pointer;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: background 0.15s, border-color 0.15s;
        }

        .bch-btn-secondary:hover {
          background: var(--accent-dim);
          border-color: rgba(212, 237, 23, 0.8);
        }

        .bch-section-anchor { scroll-margin-top: 66px; }

        /* ── Footer ── */
        .bch-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          background: rgba(5, 12, 5, 0.95);
          border-top: 0.5px solid rgba(19, 229, 19, 0.2);
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .bch-sticky-nav { padding: 12px 16px; }
          .bch-tabs { display: none; }
          .bch-hamburger { display: flex; }
          .bch-hero { min-height: 85vh; }
          .bch-hero-body { padding: 60px 20px; }
          .bch-headline { font-size: 40px; }
          .bch-sub { font-size: 15px; }
          .bch-footer { flex-direction: column; gap: 16px; padding: 20px 16px; text-align: center; }
        }

        @media (max-width: 480px) {
          .bch-logo-name { font-size: 13px; }
          .bch-headline { font-size: 32px; }
          .bch-badge { font-size: 10px; padding: 5px 12px; }
          .bch-cta-row { flex-direction: column; width: 100%; max-width: 280px; }
          .bch-btn-primary, .bch-btn-secondary { width: 100%; text-align: center; }
        }
      `}</style>

      <header className="bch-sticky-nav">
        <div className="bch-logo-wrap">
          <div className="bch-logo-icon">
            <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
              <polygon points="10,1 17,9 13,9 17,15 12.5,15 12.5,21 7.5,21 7.5,15 3,15 7,9 3,9" fill="#050f05" opacity="0.95" />
            </svg>
          </div>
          <div>
            <div className="bch-logo-name">Baguio City Hub</div>
            <div className="bch-logo-sub">City Issue Portal</div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="bch-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`bch-tab${tab === "Login / Register" ? " login" : ""}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab === "Login / Register" ? authLabel : tab}
            </button>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className={`bch-hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* Mobile drawer */}
      <div className={`bch-mobile-menu${menuOpen ? " open" : ""}`}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`bch-mobile-tab${tab === "Login / Register" ? " login" : ""}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab === "Login / Register" ? authLabel : tab}
          </button>
        ))}
      </div>

      <div className="bch-hero">
        <div className="bch-hero-bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="bch-hero-overlay" />

        <div className="bch-hero-body">
          <div className="bch-badge">
            <div className="bch-badge-dot" />
            City of Pines — Baguio City
          </div>
          <h1 className="bch-headline">
            Your voice shapes our <span>city</span>
          </h1>
          <p className="bch-sub">
            Report local issues, track resolution progress, and help make Baguio
            a better place for everyone who calls it home.
          </p>
          <div className="bch-cta-row">
           
          </div>
        </div>
      </div>

      <div ref={homeRef} className="bch-section-anchor">
        <Home />
      </div>

      <div ref={contactRef} className="bch-section-anchor">
        <ContactUS />
      </div>

      <footer className="bch-footer">
        <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
          <div style={{
            width: "30px", height: "30px", background: "#13e513",
            borderRadius: "7px", display: "flex", alignItems: "center",
            justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="16" height="18" viewBox="0 0 20 22" fill="none">
              <polygon points="10,1 17,9 13,9 17,15 12.5,15 12.5,21 7.5,21 7.5,15 3,15 7,9 3,9" fill="#050f05" opacity="0.95" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: "13px", color: "#ffffff", letterSpacing: "0.04em" }}>
              Baguio City Hub
            </div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "9px", color: "#13e513", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              City Issue Portal
            </div>
          </div>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap", justifyContent: "center" }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: tab === "Login / Register" ? 600 : 500,
                fontFamily: "'Jost', sans-serif",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
                background: "transparent",
                color: tab === "Login / Register" ? "#13e513" : "rgba(255,255,255,0.55)",
                border: tab === "Login / Register" ? "1px solid rgba(19,229,19,0.35)" : "none",
                marginLeft: tab === "Login / Register" ? "8px" : "0",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = tab === "Login / Register" ? "#13e513" : "rgba(19,229,19,0.08)";
                el.style.color = tab === "Login / Register" ? "#050f05" : "#ffffff";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = "transparent";
                el.style.color = tab === "Login / Register" ? "#13e513" : "rgba(255,255,255,0.55)";
              }}
            >
              {tab === "Login / Register" ? authLabel : tab}
            </button>
          ))}
        </nav>

        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: "12px",
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.03em",
          margin: 0,
        }}>
          © {new Date().getFullYear()} Baguio City Hub. All rights reserved.
        </p>
      </footer>
    </div>
  );
}