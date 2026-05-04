import { useNavigate } from "react-router-dom";

type FooterLink = { label: string; path: string };

const links: FooterLink[] = [
  { label: "Home", path: "/" },
  { label: "Report an Issue", path: "/user-dashboard" },
  { label: "Track Issue", path: "/user-dashboard/track" },
];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 32px",
      background: "rgba(5, 12, 5, 0.95)",
      borderTop: "0.5px solid rgba(19, 229, 19, 0.2)",
      flexWrap: "wrap",
      gap: "12px",
      fontFamily: "'Jost', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Jost:wght@400;500;600;700&display=swap');

        .ft-logo {
          display: flex; align-items: center; gap: 10px; cursor: pointer;
        }

        .ft-icon {
          width: 28px; height: 28px; background: #13e513;
          border-radius: 7px; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0;
        }

        .ft-name {
          font-family: 'Cinzel', serif; font-weight: 700;
          font-size: 12px; color: #ffffff; letter-spacing: 0.04em; line-height: 1.2;
        }

        .ft-sub {
          font-size: 9px; color: #13e513; font-weight: 500;
          letter-spacing: 0.1em; text-transform: uppercase;
        }

        .ft-links {
          display: flex; align-items: center; gap: 4px;
          flex-wrap: wrap; justify-content: center;
        }

        .ft-link {
          padding: 5px 12px; border-radius: 6px;
          font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 500;
          color: rgba(255,255,255,0.45); background: transparent; border: none;
          cursor: pointer; letter-spacing: 0.04em; text-transform: uppercase;
          transition: background 0.15s, color 0.15s;
        }

        .ft-link:hover { background: rgba(19,229,19,0.08); color: #ffffff; }

        .ft-copy {
          font-size: 11px; color: rgba(255,255,255,0.3); letter-spacing: 0.03em;
        }

        @media (max-width: 768px) {
          footer {
            flex-direction: column !important;
            align-items: center !important;
            padding: 20px 16px !important;
            text-align: center;
          }
        }
      `}</style>

      {/* Logo */}
      <div className="ft-logo" onClick={() => navigate("/")}>
        <div className="ft-icon">
          <svg width="14" height="16" viewBox="0 0 20 22" fill="none">
            <polygon points="10,1 17,9 13,9 17,15 12.5,15 12.5,21 7.5,21 7.5,15 3,15 7,9 3,9" fill="#050f05" opacity="0.95" />
          </svg>
        </div>
        <div>
          <div className="ft-name">Baguio City Hub</div>
          <div className="ft-sub">City Issue Portal</div>
        </div>
      </div>

      {/* Links */}
      <nav className="ft-links">
        {links.map((l) => (
          <button key={l.label} className="ft-link" onClick={() => navigate(l.path)}>
            {l.label}
          </button>
        ))}
      </nav>

      {/* Copyright */}
      <p className="ft-copy">
        © {new Date().getFullYear()} Baguio City Hub. All rights reserved.
      </p>
    </footer>
  );
}