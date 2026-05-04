"use client";
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000";

interface Report {
  _id: string;
  trackingNumber: string;
  title: string;
  category: string;
  urgency: string;
  status: string;
  location: string;
  description: string;
  submittedBy: string;
  createdAt: string;
}

const CATEGORIES = [
  "All",
  "Road & Infrastructure",
  "Garbage & Sanitation",
  "Flooding & Drainage",
  "Street Lighting",
  "Public Safety",
  "Parks & Public Spaces",
  "Other",
];

const STATUSES = ["All", "pending", "in-progress", "resolved"];

const statusColor: Record<string, string> = {
  pending:       "rgba(212,237,23,0.15)",
  "in-progress": "rgba(19,229,19,0.13)",
  resolved:      "rgba(80,180,255,0.13)",
};
const statusText: Record<string, string> = {
  pending:       "#d4ed17",
  "in-progress": "#13e513",
  resolved:      "#60c8ff",
};
const statusLabel: Record<string, string> = {
  pending:       "Pending",
  "in-progress": "In Progress",
  resolved:      "Resolved",
};
const urgencyText: Record<string, string> = {
  "Low — can wait":              "rgba(255,255,255,0.4)",
  "Medium — needs attention":    "#d4ed17",
  "High — urgent":               "#ffaa44",
  "Critical — immediate danger": "#ff6060",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function Home() {
  const [reports, setReports]               = useState<Report[]>([]);
  const [filtered, setFiltered]             = useState<Report[]>([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");
  const [activeStatus, setActiveStatus]     = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch]                 = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/reports`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) { setReports(data); setFiltered(data); }
        else setError(data.error || "Failed to load reports.");
      })
      .catch(() => setError("Could not connect to the server."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = reports;
    if (activeStatus !== "All")   result = result.filter((r) => r.status === activeStatus);
    if (activeCategory !== "All") result = result.filter((r) => r.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.trackingNumber.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [activeStatus, activeCategory, search, reports]);

  const countByStatus = (s: string) =>
    s === "All" ? reports.length : reports.filter((r) => r.status === s).length;

  return (
    <section style={{ width: "100%", padding: "64px 24px", fontFamily: "'Jost', sans-serif", color: "#ffffff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fauna+One&family=Cinzel:wght@700;900&family=Jost:wght@400;500;600;700&display=swap');
        :root { --primary: #13e513; --accent: #d4ed17; }

        .home-inner { max-width: 860px; margin: 0 auto; }

        .home-hero { text-align: center; margin-bottom: 48px; }
        .home-pill {
          display: inline-block; font-size: 11px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--primary); background: rgba(19,229,19,0.12);
          border: 1px solid rgba(19,229,19,0.35); border-radius: 99px;
          padding: 5px 14px; margin-bottom: 20px;
        }
        .home-title {
          font-family: 'Cinzel', serif; font-weight: 900;
          font-size: 36px; color: #fff; letter-spacing: 0.02em;
          line-height: 1.1; margin-bottom: 12px;
        }
        .home-title span { color: var(--accent); }
        .home-sub {
          font-family: 'Fauna One', serif; font-size: 15px;
          color: rgba(255,255,255,0.5); line-height: 1.75;
          max-width: 460px; margin: 0 auto;
        }

        .home-stats {
          display: flex; justify-content: center; gap: 12px;
          flex-wrap: wrap; margin-bottom: 20px;
        }
        .home-stat-chip {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 99px; cursor: pointer;
          border: 0.5px solid transparent; background: transparent;
          font-size: 12px; font-weight: 600; letter-spacing: 0.06em;
          text-transform: uppercase; transition: all 0.15s;
          font-family: 'Jost', sans-serif;
        }
        .home-stat-chip .chip-count { font-size: 15px; font-weight: 700; }

        .home-cats {
          display: flex; flex-wrap: wrap; gap: 8px;
          margin-bottom: 28px; justify-content: center;
        }
        .home-cat {
          padding: 6px 14px; border-radius: 99px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
          text-transform: uppercase; cursor: pointer;
          border: 0.5px solid rgba(19,229,19,0.2);
          background: transparent; color: rgba(255,255,255,0.45);
          font-family: 'Jost', sans-serif; transition: all 0.15s;
        }
        .home-cat:hover { background: rgba(19,229,19,0.08); color: #fff; }
        .home-cat.active {
          background: rgba(19,229,19,0.15);
          border-color: rgba(19,229,19,0.5);
          color: var(--primary);
        }

        .home-search-wrap { margin-bottom: 28px; }
        .home-search {
          width: 100%; padding: 11px 16px;
          background: rgba(19,229,19,0.05);
          border: 0.5px solid rgba(19,229,19,0.22);
          border-radius: 8px; font-family: 'Jost', sans-serif;
          font-size: 14px; color: #fff; outline: none;
          transition: border-color 0.15s;
        }
        .home-search::placeholder { color: rgba(255,255,255,0.25); }
        .home-search:focus { border-color: var(--primary); }

        .home-card {
          background: rgba(10,22,10,0.85);
          border: 0.5px solid rgba(19,229,19,0.15);
          border-radius: 14px; padding: 22px 26px;
          margin-bottom: 14px; transition: border-color 0.2s;
        }
        .home-card:hover { border-color: rgba(19,229,19,0.35); }
        .home-card-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 12px;
          margin-bottom: 10px; flex-wrap: wrap;
        }
        .home-card-id {
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.3); text-transform: uppercase; margin-bottom: 4px;
        }
        .home-card-title { font-size: 15px; font-weight: 600; color: #fff; }
        .home-badge {
          display: inline-block; padding: 4px 12px; border-radius: 99px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
          text-transform: uppercase; flex-shrink: 0;
        }
        .home-meta {
          display: flex; gap: 18px; flex-wrap: wrap;
          font-size: 12px; color: rgba(255,255,255,0.4);
          margin-bottom: 10px; letter-spacing: 0.02em;
        }
        .home-meta b { color: rgba(255,255,255,0.6); font-weight: 500; }
        .home-desc {
          background: rgba(19, 229, 19, 0.05);
          border-left: 2px solid rgba(19, 229, 19, 0.25);
          border-radius: 0 6px 6px 0;
          padding: 9px 13px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          height: -webkit-fill-available;
        }

        .home-empty {
          text-align: center; padding: 60px 20px;
          color: rgba(255,255,255,0.3); font-size: 15px;
          font-family: 'Fauna One', serif;
        }
        .home-loading {
          text-align: center; padding: 60px 20px;
          color: rgba(19,229,19,0.6); font-size: 13px;
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .home-error {
          background: rgba(229,57,19,0.08);
          border: 0.5px solid rgba(229,57,19,0.3);
          border-radius: 8px; padding: 12px 16px;
          font-size: 13px; color: rgba(255,120,80,0.9); margin-bottom: 20px;
        }

        @media (max-width: 600px) {
          .home-title { font-size: 26px; }
          .home-card { padding: 16px; }
          .home-card-top { flex-direction: column; }
        }
      `}</style>

      <div className="home-inner">

       

        <div className="home-stats">
          {STATUSES.map((s) => {
            const isActive = activeStatus === s;
            const color =
              s === "pending"     ? "#d4ed17" :
              s === "in-progress" ? "#13e513" :
              s === "resolved"    ? "#60c8ff" : "rgba(255,255,255,0.7)";
            const bg =
              s === "pending"     ? "rgba(212,237,23,0.12)" :
              s === "in-progress" ? "rgba(19,229,19,0.12)"  :
              s === "resolved"    ? "rgba(80,180,255,0.12)" : "rgba(255,255,255,0.06)";
            return (
              <button
                key={s}
                className="home-stat-chip"
                onClick={() => setActiveStatus(s)}
                style={{
                  background:  isActive ? bg    : "transparent",
                  borderColor: isActive ? color : "rgba(255,255,255,0.12)",
                  color:       isActive ? color : "rgba(255,255,255,0.45)",
                }}
              >
                <span className="chip-count">{countByStatus(s)}</span>
                {s === "All" ? "All Reports" : statusLabel[s] ?? s}
              </button>
            );
          })}
        </div>

        <div className="home-cats">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`home-cat${activeCategory === c ? " active" : ""}`}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="home-search-wrap">
          <input
            className="home-search"
            type="text"
            placeholder="Search by title, tracking number, or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && <div className="home-loading">Loading reports…</div>}
        {error   && <div className="home-error">⚠ {error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="home-empty">No reports match your filters.</div>
        )}

        {filtered.map((issue) => (
          <div className="home-card" key={issue._id}>
            <div className="home-card-top">
              <div>
                <div className="home-card-id">{issue.trackingNumber}</div>
                <div className="home-card-title">{issue.title}</div>
              </div>
              <span
                className="home-badge"
                style={{
                  background: statusColor[issue.status] ?? "rgba(255,255,255,0.08)",
                  color:      statusText[issue.status]  ?? "#fff",
                }}
              >
                {statusLabel[issue.status] ?? issue.status}
              </span>
            </div>

            <div className="home-meta">
              <span><b>Category:</b> {issue.category}</span>
              <span>
                <b>Urgency:</b>{" "}
                <span style={{ color: urgencyText[issue.urgency] ?? "rgba(255,255,255,0.4)" }}>
                  {issue.urgency}
                </span>
              </span>
              <span><b>Location:</b> {issue.location}</span>
              <span><b>Filed:</b> {formatDate(issue.createdAt)}</span>
            </div>

            <div className="home-desc">{issue.description}</div>
          </div>
        ))}

      </div>
    </section>
  );
}