"use client";
import { useEffect, useState } from "react";
import UserNavigation from "./UserNavigation";
import Footer from "./Footer";

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
  createdAt: string;
}

const statusColor: Record<string, string> = {
  pending:      "rgba(212,237,23,0.15)",
  "in-progress":"rgba(19,229,19,0.13)",
  resolved:     "rgba(80,180,255,0.13)",
};

const statusText: Record<string, string> = {
  pending:      "#d4ed17",
  "in-progress":"#13e513",
  resolved:     "#60c8ff",
};

const statusLabel: Record<string, string> = {
  pending:      "Pending",
  "in-progress":"In Progress",
  resolved:     "Resolved",
};

const urgencyText: Record<string, string> = {
  "Low — can wait":           "rgba(255,255,255,0.4)",
  "Medium — needs attention": "#d4ed17",
  "High — urgent":            "#ffaa44",
  "Critical — immediate danger": "#ff6060",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function UserIssueTracker() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filtered, setFiltered] = useState<Report[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to view your reports.");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/reports/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReports(data);
          setFiltered(data);
        } else {
          setError(data.error || "Failed to load reports.");
        }
      })
      .catch(() => setError("Could not connect to the server."))
      .finally(() => setLoading(false));
  }, []);

  // filter whenever search or status changes
  useEffect(() => {
    let result = reports;

    if (statusFilter) {
      result = result.filter((r) => r.status === statusFilter);
    }

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
  }, [search, statusFilter, reports]);

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", minHeight: "100vh", background: "#0a1a0a", color: "#ffffff", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fauna+One&family=Cinzel:wght@700;900&family=Jost:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --primary: #13e513; --accent: #d4ed17; }

        .uit-main { max-width: 800px; margin: 0 auto; padding: 48px 24px; flex: 1; }

        .uit-page-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--primary); margin-bottom: 8px;
        }

        .uit-heading {
          font-family: 'Cinzel', serif; font-weight: 900;
          font-size: 32px; color: #ffffff; letter-spacing: 0.02em;
          margin-bottom: 8px; line-height: 1.15;
        }

        .uit-heading span { color: var(--accent); }

        .uit-subheading {
          font-family: 'Fauna One', serif; font-size: 15px;
          color: rgba(255,255,255,0.5); line-height: 1.7; margin-bottom: 36px;
        }

        .uit-search-wrap {
          display: flex; gap: 10px; margin-bottom: 28px; flex-wrap: wrap;
        }

        .uit-search {
          flex: 1; min-width: 200px;
          padding: 11px 14px;
          background: rgba(19,229,19,0.05);
          border: 0.5px solid rgba(19,229,19,0.22);
          border-radius: 8px;
          font-family: 'Jost', sans-serif; font-size: 14px; color: #ffffff;
          outline: none; transition: border-color 0.15s;
        }

        .uit-search::placeholder { color: rgba(255,255,255,0.25); }
        .uit-search:focus { border-color: var(--primary); }

        .uit-filter {
          padding: 11px 14px;
          background: rgba(19,229,19,0.05);
          border: 0.5px solid rgba(19,229,19,0.22);
          border-radius: 8px;
          font-family: 'Jost', sans-serif; font-size: 14px; color: #ffffff;
          outline: none; cursor: pointer;
        }

        .uit-filter option { background: #0a1a0a; }

        .uit-card {
          background: rgba(10, 22, 10, 0.85);
          border: 0.5px solid rgba(19, 229, 19, 0.15);
          border-radius: 14px;
          padding: 24px 28px;
          margin-bottom: 16px;
          transition: border-color 0.2s;
        }

        .uit-card:hover { border-color: rgba(19, 229, 19, 0.35); }

        .uit-card-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 12px;
          margin-bottom: 10px; flex-wrap: wrap;
        }

        .uit-card-id {
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.35); text-transform: uppercase;
          margin-bottom: 4px;
        }

        .uit-card-title {
          font-size: 16px; font-weight: 600; color: #ffffff;
          letter-spacing: 0.01em;
        }

        .uit-badge {
          display: inline-block;
          padding: 4px 12px; border-radius: 99px;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          flex-shrink: 0;
        }

        .uit-meta {
          display: flex; gap: 20px; flex-wrap: wrap;
          font-size: 12px; color: rgba(255,255,255,0.4);
          margin-bottom: 12px; letter-spacing: 0.02em;
        }

        .uit-meta span b { color: rgba(255,255,255,0.65); font-weight: 500; }

        .uit-update {
          background: rgba(19, 229, 19, 0.05);
          border-left: 2px solid rgba(19, 229, 19, 0.3);
          border-radius: 0 6px 6px 0;
          padding: 10px 14px;
          font-size: 13px; color: rgba(255,255,255,0.55);
          line-height: 1.6;
        }

        .uit-empty {
          text-align: center; padding: 60px 20px;
          color: rgba(255,255,255,0.3); font-size: 15px;
          font-family: 'Fauna One', serif;
        }

        .uit-loading {
          text-align: center; padding: 60px 20px;
          color: rgba(19,229,19,0.6); font-size: 14px; letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .uit-error {
          background: rgba(229,57,19,0.08);
          border: 0.5px solid rgba(229,57,19,0.3);
          border-radius: 8px; padding: 12px 16px;
          font-size: 13px; color: rgba(255,120,80,0.9);
          margin-bottom: 20px;
        }

        @media (max-width: 600px) {
          .uit-heading { font-size: 24px; }
          .uit-card { padding: 18px 16px; }
          .uit-card-top { flex-direction: column; }
        }
      `}</style>

      <UserNavigation />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <main className="uit-main">
        <p className="uit-page-label">Citizen Portal</p>
        <h1 className="uit-heading">Track <span>Issues</span></h1>
        <p className="uit-subheading">
          Monitor the status of your submitted reports and see updates from city
          departments in real time.
        </p>

        <div className="uit-search-wrap">
          <input
            className="uit-search"
            type="text"
            placeholder="Search by title, tracking number, or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="uit-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {loading && <div className="uit-loading">Loading your reports…</div>}

        {error && <div className="uit-error">⚠ {error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="uit-empty">
            {reports.length === 0
              ? "You haven't submitted any reports yet."
              : "No reports match your search."}
          </div>
        )}

        {filtered.map((issue) => (
          <div className="uit-card" key={issue._id}>
            <div className="uit-card-top">
              <div>
                <div className="uit-card-id">{issue.trackingNumber}</div>
                <div className="uit-card-title">{issue.title}</div>
              </div>
              <span
                className="uit-badge"
                style={{
                  background: statusColor[issue.status] ?? "rgba(255,255,255,0.1)",
                  color: statusText[issue.status] ?? "#ffffff",
                }}
              >
                {statusLabel[issue.status] ?? issue.status}
              </span>
            </div>

            <div className="uit-meta">
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

            <div className="uit-update">
              {issue.description}
            </div>
          </div>
        ))}
      </main>
      </div>
      <Footer />
    </div>
  );
}