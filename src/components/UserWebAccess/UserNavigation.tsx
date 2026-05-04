import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type Tab = "Home" | "Report an Issue" | "Track Issue" | "Logout";
const tabs: Tab[] = ["Home", "Report an Issue", "Track Issue", "Logout"];

function UserNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const handleTabClick = (tab: Tab) => {
    setMenuOpen(false);
    if (tab === "Home") {
      navigate("/");
    } else if (tab === "Report an Issue") {
      navigate("/user-dashboard");
    } else if (tab === "Track Issue") {
      navigate("/user-dashboard/track");
    } else if (tab === "Logout") {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      navigate("/");
    }
  };

  const isActive = (tab: Tab) => {
    if (tab === "Report an Issue") return location.pathname === "/user-dashboard";
    if (tab === "Track Issue") return location.pathname === "/user-dashboard/track";
    return false;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fauna+One&family=Cinzel:wght@700;900&family=Jost:wght@400;500;600;700&display=swap');

        :root {
          --primary: #13e513;
          --primary-dim: rgba(19, 229, 19, 0.18);
          --primary-border: rgba(19, 229, 19, 0.4);
        }

        .un-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 32px;
          background: rgba(5, 12, 5, 0.95);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 0.5px solid rgba(19, 229, 19, 0.2);
          font-family: 'Jost', sans-serif;
        }

        .un-logo-wrap {
          display: flex;
          align-items: center;
          gap: 11px;
          cursor: pointer;
        }

        .un-logo-icon {
          width: 36px;
          height: 36px;
          background: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .un-logo-name {
          font-family: 'Cinzel', serif;
          font-weight: 700;
          font-size: 15px;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: 0.04em;
        }

        .un-logo-sub {
          font-size: 10px;
          color: var(--primary);
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* greeting pill */
        .un-greeting {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(19, 229, 19, 0.08);
          border: 0.5px solid rgba(19, 229, 19, 0.2);
          border-radius: 99px;
          padding: 5px 14px 5px 8px;
          font-size: 12px;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.03em;
        }

        .un-greeting-avatar {
          width: 24px;
          height: 24px;
          background: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: #050f05;
          flex-shrink: 0;
        }

        /* desktop tabs */
        .un-tabs {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .un-tab {
          padding: 7px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.65);
          cursor: pointer;
          letter-spacing: 0.04em;
          border: none;
          background: transparent;
          font-family: 'Jost', sans-serif;
          transition: background 0.15s, color 0.15s;
          text-transform: uppercase;
        }

        .un-tab:hover {
          background: rgba(19, 229, 19, 0.1);
          color: #ffffff;
        }

        .un-tab.active {
          background: rgba(19, 229, 19, 0.15);
          color: var(--primary);
        }

        .un-tab.logout {
          border: 1px solid rgba(255, 80, 80, 0.35);
          color: rgba(255, 120, 120, 0.8);
          margin-left: 8px;
        }

        .un-tab.logout:hover {
          background: rgba(255, 80, 80, 0.12);
          color: #ff8a8a;
          border-color: rgba(255, 80, 80, 0.6);
        }

        /* hamburger */
        .un-hamburger {
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

        .un-hamburger span {
          display: block;
          width: 100%;
          height: 1.5px;
          background: var(--primary);
          border-radius: 2px;
          transition: transform 0.2s, opacity 0.2s;
        }

        .un-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .un-hamburger.open span:nth-child(2) { opacity: 0; }
        .un-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* mobile drawer */
        .un-mobile-menu {
          display: none;
          position: fixed;
          top: 65px;
          left: 0;
          right: 0;
          z-index: 99;
          background: rgba(5, 12, 5, 0.97);
          backdrop-filter: blur(14px);
          border-bottom: 0.5px solid rgba(19, 229, 19, 0.2);
          padding: 12px 16px 16px;
          flex-direction: column;
          gap: 4px;
          font-family: 'Jost', sans-serif;
        }

        .un-mobile-menu.open { display: flex; }

        .un-mobile-greeting {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          margin-bottom: 4px;
          border-bottom: 0.5px solid rgba(19, 229, 19, 0.1);
          padding-bottom: 12px;
        }

        .un-mobile-tab {
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

        .un-mobile-tab:hover { background: rgba(19, 229, 19, 0.1); color: #ffffff; }
        .un-mobile-tab.active { background: rgba(19, 229, 19, 0.12); color: var(--primary); }

        .un-mobile-tab.logout {
          border: 1px solid rgba(255, 80, 80, 0.3);
          color: rgba(255, 120, 120, 0.8);
          margin-top: 4px;
        }

        .un-mobile-tab.logout:hover {
          background: rgba(255, 80, 80, 0.1);
          color: #ff8a8a;
        }

        @media (max-width: 768px) {
          .un-nav { padding: 12px 16px; }
          .un-tabs { display: none; }
          .un-greeting { display: none; }
          .un-hamburger { display: flex; }
        }

        @media (max-width: 480px) {
          .un-logo-name { font-size: 13px; }
        }
      `}</style>

      <header className="un-nav">
        {/* Logo */}
        <div className="un-logo-wrap" onClick={() => navigate("/")}>
          <div className="un-logo-icon">
            <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
              <polygon points="10,1 17,9 13,9 17,15 12.5,15 12.5,21 7.5,21 7.5,15 3,15 7,9 3,9" fill="#050f05" opacity="0.95" />
            </svg>
          </div>
          <div>
            <div className="un-logo-name">Baguio City Hub</div>
            <div className="un-logo-sub">City Issue Portal</div>
          </div>
        </div>

        {/* Desktop tabs */}
        <nav className="un-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`un-tab${tab === "Logout" ? " logout" : ""}${isActive(tab) ? " active" : ""}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Greeting pill — desktop only */}
        <div className="un-greeting">
          <div className="un-greeting-avatar">
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
          </div>
          {user.fullName || user.email || "Citizen"}
        </div>

        {/* Hamburger */}
        <button
          className={`un-hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </header>

      {/* Mobile drawer */}
      <div className={`un-mobile-menu${menuOpen ? " open" : ""}`}>
        <div className="un-mobile-greeting">
          <div className="un-greeting-avatar">
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
          </div>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
            {user.fullName || user.email || "Citizen"}
          </span>
        </div>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`un-mobile-tab${tab === "Logout" ? " logout" : ""}${isActive(tab) ? " active" : ""}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </>
  );
}

export default UserNavigation;