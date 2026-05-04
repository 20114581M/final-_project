import { useNavigate } from "react-router-dom";

function AdminNvigation() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
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
        body {
          margin: 0; padding: 0; 
        }
        .an-nav {
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

        .an-logo-wrap {
          display: flex;
          align-items: center;
          gap: 11px;
          cursor: pointer;
        }

        .an-logo-icon {
          width: 36px;
          height: 36px;
          background: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .an-logo-name {
          font-family: 'Cinzel', serif;
          font-weight: 700;
          font-size: 15px;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: 0.04em;
        }

        .an-logo-sub {
          font-size: 10px;
          color: var(--primary);
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .an-logout {
          padding: 7px 18px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          font-family: 'Jost', sans-serif;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          border: 1px solid rgba(255, 80, 80, 0.35);
          background: transparent;
          color: rgba(255, 120, 120, 0.8);
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }

        .an-logout:hover {
          background: rgba(255, 80, 80, 0.12);
          color: #ff8a8a;
          border-color: rgba(255, 80, 80, 0.6);
        }

        @media (max-width: 768px) {
          .an-nav { padding: 12px 16px; }
          .an-logout { padding: 6px 14px; font-size: 12px; }
        }

        @media (max-width: 480px) {
          .an-logo-name { font-size: 13px; }
          .an-logo-sub { font-size: 9px; }
          .an-logo-icon { width: 30px; height: 30px; border-radius: 6px; }
          .an-logo-wrap { gap: 8px; }
          .an-logout { padding: 6px 12px; font-size: 11px; letter-spacing: 0.02em; }
        }

        @media (max-width: 360px) {
          .an-logo-sub { display: none; }
          .an-logo-name { font-size: 12px; }
        }
      `}</style>

      <header className="an-nav">
        {/* Logo */}
        <div className="an-logo-wrap" onClick={() => navigate("/")}>
          <div className="an-logo-icon">
            <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
              <polygon points="10,1 17,9 13,9 17,15 12.5,15 12.5,21 7.5,21 7.5,15 3,15 7,9 3,9" fill="#050f05" opacity="0.95" />
            </svg>
          </div>
          <div>
            <div className="an-logo-name">Baguio City Hub</div>
            <div className="an-logo-sub">Admin Portal</div>
          </div>
        </div>

        {/* Logout */}
        <button className="an-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>
    </>
  );
}

export default AdminNvigation;