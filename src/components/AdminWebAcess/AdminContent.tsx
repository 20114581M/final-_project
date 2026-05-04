import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000";

// ── Types ──────────────────────────────────────────────────────────────────

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

interface LogEntry {
  time: string;
  type: string;
  text: string;
}

interface ParsedDescription {
  base: string;
  logs: LogEntry[];
}

interface StatusMeta {
  color: string;
  bg: string;
  label: string;
}

// ── Constants ──────────────────────────────────────────────────────────────

const CATEGORIES: string[] = [
  "All",
  "Road & Infrastructure",
  "Garbage & Sanitation",
  "Flooding & Drainage",
  "Street Lighting",
  "Public Safety",
  "Parks & Public Spaces",
  "Other",
];

const STATUSES: string[] = ["All", "pending", "in-progress", "resolved"];

const STATUS_META: Record<string, StatusMeta> = {
  pending:       { color: "#d4ed17", bg: "rgba(212,237,23,0.13)", label: "Pending" },
  "in-progress": { color: "#13e513", bg: "rgba(19,229,19,0.13)",  label: "In Progress" },
  resolved:      { color: "#60c8ff", bg: "rgba(80,180,255,0.13)", label: "Resolved" },
};

const URGENCY_COLOR: Record<string, string> = {
  "Low — can wait":              "rgba(255,255,255,0.38)",
  "Medium — needs attention":    "#d4ed17",
  "High — urgent":               "#ffaa44",
  "Critical — immediate danger": "#ff6060",
};

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function parseDescription(raw: string): ParsedDescription {
  const logSep = "\n\n---";
  const idx = raw.indexOf(logSep);
  if (idx === -1) return { base: raw, logs: [] };

  const base = raw.slice(0, idx);
  const logBlock = raw.slice(idx + logSep.length).trim();
  const logs: LogEntry[] = logBlock
    .split("\n")
    .map((l: string) => l.trim())
    .filter(Boolean)
    .map((l: string): LogEntry => {
      const match = l.match(/^\[(.+?)\]\s*\[(.+?)\]\s*(.+)$/);
      if (match) return { time: match[1], type: match[2], text: match[3] };
      return { time: "", type: "NOTE", text: l };
    });

  return { base, logs };
}

// ── Component ──────────────────────────────────────────────────────────────

export default function AdminContent(): React.ReactElement {
  const [reports, setReports]                     = useState<Report[]>([]);
  const [filtered, setFiltered]                   = useState<Report[]>([]);
  const [loading, setLoading]                     = useState<boolean>(true);
  const [error, setError]                         = useState<string>("");
  const [activeStatus, setActiveStatus]           = useState<string>("All");
  const [activeCategory, setActiveCategory]       = useState<string>("All");
  const [search, setSearch]                       = useState<string>("");

  // Modal state
  const [selected, setSelected]                   = useState<Report | null>(null);
  const [modalOpen, setModalOpen]                 = useState<boolean>(false);

  // Edit state inside modal
  const [newStatus, setNewStatus]                 = useState<string>("");
  const [comment, setComment]                     = useState<string>("");
  const [saving, setSaving]                       = useState<boolean>(false);
  const [saveMsg, setSaveMsg]                     = useState<string>("");
  const [deleteConfirm, setDeleteConfirm]         = useState<boolean>(false);
  const [deleting, setDeleting]                   = useState<boolean>(false);

  useEffect(() => {
    loadReports();
  }, []);

  function loadReports(): void {
    setLoading(true);
    fetch(`${API_BASE}/reports`)
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) {
          setReports(data as Report[]);
          setFiltered(data as Report[]);
        } else {
          const err = data as { error?: string };
          setError(err.error ?? "Failed to load reports.");
        }
      })
      .catch(() => setError("Could not connect to the server."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let result: Report[] = reports;
    if (activeStatus !== "All")   result = result.filter((r) => r.status === activeStatus);
    if (activeCategory !== "All") result = result.filter((r) => r.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.trackingNumber.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          (r.submittedBy ?? "").toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [activeStatus, activeCategory, search, reports]);

  const countByStatus = (s: string): number =>
    s === "All" ? reports.length : reports.filter((r) => r.status === s).length;

  function openModal(report: Report): void {
    setSelected(report);
    setNewStatus(report.status);
    setComment("");
    setSaveMsg("");
    setDeleteConfirm(false);
    setModalOpen(true);
  }

  function closeModal(): void {
    setModalOpen(false);
    setSelected(null);
    setDeleteConfirm(false);
  }

  async function handleSave(): Promise<void> {
    if (!selected) return;
    if (!comment.trim() && newStatus === selected.status) {
      setSaveMsg("No changes to save.");
      return;
    }

    setSaving(true);
    setSaveMsg("");

    try {
      const now = formatDateTime(new Date().toISOString());
      const logLines: string[] = [];

      if (newStatus !== selected.status) {
        const fromLabel = STATUS_META[selected.status]?.label ?? selected.status;
        const toLabel   = STATUS_META[newStatus]?.label ?? newStatus;
        logLines.push(`[${now}] [STATUS] Changed from "${fromLabel}" to "${toLabel}"`);
      }
      if (comment.trim()) {
        logLines.push(`[${now}] [COMMENT] ${comment.trim()}`);
      }

      const existingDesc   = selected.description ?? "";
      const hasSep         = existingDesc.includes("\n\n---");
      const appendage      = logLines.join("\n");
      const updatedDescription = hasSep
        ? existingDesc + "\n" + appendage
        : existingDesc + "\n\n---\n" + appendage;

      const token = sessionStorage.getItem("token") ?? "";
      const res = await fetch(`${API_BASE}/reports/${selected._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, description: updatedDescription }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(errData.error ?? "Server error");
      }

      // Refresh local state
      const updatedReport: Report = { ...selected, status: newStatus, description: updatedDescription };
      setReports((prev) => prev.map((r) => (r._id === selected._id ? updatedReport : r)));
      setSelected(updatedReport);
      setComment("");
      setSaveMsg("Changes saved successfully.");
    } catch {
      setSaveMsg("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(): Promise<void> {
    if (!selected) return;
    if (!deleteConfirm) { setDeleteConfirm(true); return; }

    setDeleting(true);
    try {
      const token = sessionStorage.getItem("token") ?? "";
      const res = await fetch(`${API_BASE}/reports/${selected._id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(errData.error ?? "Server error");
      }
      setReports((prev) => prev.filter((r) => r._id !== selected._id));
      closeModal();
    } catch {
      setSaveMsg("Failed to delete. Please try again.");
    } finally {
      setDeleting(false);
      setDeleteConfirm(false);
    }
  }

  const { base: modalBase, logs: modalLogs }: ParsedDescription = selected
    ? parseDescription(selected.description ?? "")
    : { base: "", logs: [] };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section style={{ width: "100%", minHeight: "100vh", padding: "56px 24px 80px", fontFamily: "'Jost', sans-serif", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fauna+One&family=Cinzel:wght@700;900&family=Jost:wght@400;500;600;700&display=swap');
        :root { --primary: #13e513; --accent: #d4ed17; }

        .ac-inner { max-width: 920px; margin: 0 auto; }

        .ac-hero { margin-bottom: 44px; }
        .ac-pill {
          display: inline-block; font-size: 10px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #d4ed17; background: rgba(212,237,23,0.1);
          border: 1px solid rgba(212,237,23,0.3); border-radius: 99px;
          padding: 5px 14px; margin-bottom: 16px;
        }
        .ac-title {
          font-family: 'Cinzel', serif; font-weight: 900;
          font-size: 32px; color: #fff; letter-spacing: 0.02em;
          line-height: 1.1; margin-bottom: 8px;
        }
        .ac-title span { color: var(--accent); }
        .ac-sub {
          font-family: 'Fauna One', serif; font-size: 14px;
          color: rgba(255,255,255,0.4); line-height: 1.7;
        }

        .ac-stats { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
        .ac-chip {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 16px; border-radius: 99px; cursor: pointer;
          border: 0.5px solid transparent; background: transparent;
          font-size: 11px; font-weight: 700; letter-spacing: 0.07em;
          text-transform: uppercase; transition: all 0.15s;
          font-family: 'Jost', sans-serif;
        }
        .ac-chip .chip-n { font-size: 16px; font-weight: 800; }

        .ac-cats { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 24px; }
        .ac-cat {
          padding: 5px 13px; border-radius: 99px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.07em;
          text-transform: uppercase; cursor: pointer;
          border: 0.5px solid rgba(19,229,19,0.18);
          background: transparent; color: rgba(255,255,255,0.38);
          font-family: 'Jost', sans-serif; transition: all 0.15s;
        }
        .ac-cat:hover { background: rgba(19,229,19,0.08); color: #fff; }
        .ac-cat.active { background: rgba(19,229,19,0.14); border-color: rgba(19,229,19,0.45); color: var(--primary); }

        .ac-search-wrap { margin-bottom: 26px; position: relative; }
        .ac-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); opacity: 0.3; pointer-events: none; }
        .ac-search {
          width: 100%; padding: 11px 16px 11px 40px; box-sizing: border-box;
          background: rgba(19,229,19,0.04);
          border: 0.5px solid rgba(19,229,19,0.2);
          border-radius: 8px; font-family: 'Jost', sans-serif;
          font-size: 13px; color: #fff; outline: none; transition: border-color 0.15s;
        }
        .ac-search::placeholder { color: rgba(255,255,255,0.2); }
        .ac-search:focus { border-color: var(--primary); }

        .ac-card {
          background: rgba(8,18,8,0.9);
          border: 0.5px solid rgba(19,229,19,0.13);
          border-radius: 14px; padding: 20px 24px;
          margin-bottom: 12px; cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          position: relative; overflow: hidden;
        }
        .ac-card::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px; border-radius: 14px 0 0 14px;
          background: var(--primary); opacity: 0; transition: opacity 0.2s;
        }
        .ac-card:hover { border-color: rgba(19,229,19,0.32); background: rgba(12,24,12,0.95); }
        .ac-card:hover::before { opacity: 1; }

        .ac-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 10px; flex-wrap: wrap; }
        .ac-card-id { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; color: rgba(255,255,255,0.25); text-transform: uppercase; margin-bottom: 3px; }
        .ac-card-title { font-size: 15px; font-weight: 600; color: #fff; }
        .ac-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 12px; border-radius: 99px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.07em;
          text-transform: uppercase; flex-shrink: 0;
        }
        .ac-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
        .ac-meta { display: flex; gap: 16px; flex-wrap: wrap; font-size: 11px; color: rgba(255,255,255,0.35); margin-bottom: 10px; letter-spacing: 0.02em; }
        .ac-meta b { color: rgba(255,255,255,0.55); font-weight: 500; }
        .ac-desc {
          background: rgba(19,229,19,0.04); border-left: 2px solid rgba(19,229,19,0.2);
          border-radius: 0 6px 6px 0; padding: 8px 12px;
          font-size: 12px; color: rgba(255,255,255,0.42); line-height: 1.65;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .ac-card-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 12px; padding-top: 10px;
          border-top: 0.5px solid rgba(255,255,255,0.06);
          font-size: 11px; color: rgba(255,255,255,0.28); flex-wrap: wrap; gap: 6px;
        }
        .ac-manage-btn {
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--primary);
          border: 1px solid rgba(19,229,19,0.3); background: rgba(19,229,19,0.07);
          border-radius: 6px; padding: 5px 12px; cursor: pointer;
          font-family: 'Jost', sans-serif; transition: all 0.15s;
        }
        .ac-manage-btn:hover { background: rgba(19,229,19,0.14); border-color: var(--primary); }

        .ac-empty { text-align: center; padding: 60px 20px; color: rgba(255,255,255,0.25); font-size: 14px; font-family: 'Fauna One', serif; }
        .ac-loading { text-align: center; padding: 60px 20px; color: rgba(19,229,19,0.5); font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; }
        .ac-error { background: rgba(229,57,19,0.07); border: 0.5px solid rgba(229,57,19,0.28); border-radius: 8px; padding: 12px 16px; font-size: 13px; color: rgba(255,120,80,0.9); margin-bottom: 20px; }

        .ac-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.75); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: acFadeIn 0.18s ease;
        }
        @keyframes acFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .ac-modal {
          background: rgba(6,14,6,0.98);
          border: 0.5px solid rgba(19,229,19,0.25);
          border-radius: 18px; width: 100%; max-width: 680px;
          max-height: 90vh; overflow-y: auto;
          padding: 32px; position: relative;
          animation: acSlideUp 0.2s ease;
          scrollbar-width: thin; scrollbar-color: rgba(19,229,19,0.2) transparent;
        }
        @keyframes acSlideUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .ac-modal::-webkit-scrollbar { width: 4px; }
        .ac-modal::-webkit-scrollbar-thumb { background: rgba(19,229,19,0.2); border-radius: 99px; }

        .ac-modal-close {
          position: absolute; top: 20px; right: 20px;
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(255,255,255,0.05); border: 0.5px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5); font-size: 16px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; font-family: 'Jost', sans-serif;
        }
        .ac-modal-close:hover { background: rgba(255,80,80,0.12); border-color: rgba(255,80,80,0.4); color: #ff8a8a; }

        .ac-modal-id { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; color: rgba(255,255,255,0.25); text-transform: uppercase; margin-bottom: 6px; }
        .ac-modal-title { font-family: 'Cinzel', serif; font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 18px; line-height: 1.3; padding-right: 40px; }

        .ac-modal-section { margin-bottom: 22px; }
        .ac-modal-label { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 8px; }

        .ac-modal-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .ac-modal-info-item { background: rgba(19,229,19,0.04); border: 0.5px solid rgba(19,229,19,0.1); border-radius: 8px; padding: 10px 14px; }
        .ac-modal-info-key { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 4px; }
        .ac-modal-info-val { font-size: 13px; color: rgba(255,255,255,0.8); font-weight: 500; }

        .ac-modal-desc { font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.7; background: rgba(19,229,19,0.04); border-left: 2px solid rgba(19,229,19,0.2); border-radius: 0 8px 8px 0; padding: 12px 16px; white-space: pre-wrap; }

        .ac-log { display: flex; flex-direction: column; gap: 8px; }
        .ac-log-item {
          display: flex; gap: 10px; align-items: flex-start;
          padding: 9px 12px; border-radius: 8px;
          background: rgba(255,255,255,0.03); border: 0.5px solid rgba(255,255,255,0.07);
        }
        .ac-log-type-badge {
          font-size: 9px; font-weight: 800; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 3px 8px; border-radius: 4px;
          flex-shrink: 0; margin-top: 1px;
        }
        .ac-log-type-STATUS  { background: rgba(96,200,255,0.12); color: #60c8ff; }
        .ac-log-type-COMMENT { background: rgba(19,229,19,0.1);   color: var(--primary); }
        .ac-log-type-NOTE    { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.4); }
        .ac-log-body { flex: 1; }
        .ac-log-text { font-size: 12px; color: rgba(255,255,255,0.65); line-height: 1.5; }
        .ac-log-time { font-size: 10px; color: rgba(255,255,255,0.25); margin-top: 3px; letter-spacing: 0.03em; }

        .ac-divider { border: none; border-top: 0.5px solid rgba(19,229,19,0.1); margin: 22px 0; }

        .ac-status-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .ac-status-opt {
          padding: 8px 18px; border-radius: 8px; cursor: pointer;
          font-size: 11px; font-weight: 700; letter-spacing: 0.07em;
          text-transform: uppercase; font-family: 'Jost', sans-serif;
          border: 1px solid transparent; background: transparent;
          transition: all 0.15s;
        }

        .ac-textarea {
          width: 100%; box-sizing: border-box;
          padding: 11px 14px; border-radius: 8px;
          background: rgba(19,229,19,0.04);
          border: 0.5px solid rgba(19,229,19,0.2);
          font-family: 'Jost', sans-serif; font-size: 13px;
          color: #fff; outline: none; resize: vertical; min-height: 90px;
          transition: border-color 0.15s;
        }
        .ac-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .ac-textarea:focus { border-color: var(--primary); }

        .ac-save-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-top: 6px; }
        .ac-save-msg { font-size: 12px; }
        .ac-save-msg.ok  { color: var(--primary); }
        .ac-save-msg.err { color: #ff8a8a; }
        .ac-save-btn {
          padding: 9px 24px; border-radius: 8px;
          background: var(--primary); color: #050f05;
          font-family: 'Jost', sans-serif; font-size: 12px;
          font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
          border: none; cursor: pointer; transition: opacity 0.15s;
          flex-shrink: 0;
        }
        .ac-save-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .ac-save-btn:not(:disabled):hover { opacity: 0.85; }

        .ac-delete-btn {
          padding: 9px 20px; border-radius: 8px;
          font-family: 'Jost', sans-serif; font-size: 12px;
          font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
          border: 1px solid rgba(255, 80, 80, 0.35); background: transparent;
          color: rgba(255, 120, 120, 0.8); cursor: pointer;
          transition: all 0.15s; flex-shrink: 0;
        }
        .ac-delete-btn:hover:not(:disabled) {
          background: rgba(255, 80, 80, 0.12);
          border-color: rgba(255, 80, 80, 0.6);
          color: #ff8a8a;
        }
        .ac-delete-btn.confirm {
          background: rgba(255, 60, 60, 0.15);
          border-color: rgba(255, 60, 60, 0.7);
          color: #ff6060;
          animation: acPulse 0.3s ease;
        }
        @keyframes acPulse { 0%{transform:scale(1)} 50%{transform:scale(1.04)} 100%{transform:scale(1)} }
        .ac-delete-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        @media (max-width: 600px) {
          .ac-title { font-size: 24px; }
          .ac-modal { padding: 22px 18px; border-radius: 14px; }
          .ac-modal-info-grid { grid-template-columns: 1fr; }
          .ac-card { padding: 16px; }
          .ac-card-top { flex-direction: column; }
        }
      `}</style>

      <div className="ac-inner">

        {/* Hero */}
        <div className="ac-hero">
          <div className="ac-pill">⚙ Admin Console</div>
          <div className="ac-title">Issue <span>Management</span></div>
          <div className="ac-sub">Review, update status, and annotate citizen-submitted reports.</div>
        </div>

        {/* Stat chips */}
        <div className="ac-stats">
          {STATUSES.map((s) => {
            const isActive = activeStatus === s;
            const meta     = STATUS_META[s] as StatusMeta | undefined;
            const color    = meta?.color ?? "rgba(255,255,255,0.6)";
            const bg       = meta?.bg    ?? "rgba(255,255,255,0.06)";
            return (
              <button
                key={s}
                className="ac-chip"
                onClick={() => setActiveStatus(s)}
                style={{
                  background:  isActive ? bg    : "transparent",
                  borderColor: isActive ? color : "rgba(255,255,255,0.1)",
                  color:       isActive ? color : "rgba(255,255,255,0.38)",
                }}
              >
                <span className="chip-n">{countByStatus(s)}</span>
                {s === "All" ? "All Reports" : meta?.label ?? s}
              </button>
            );
          })}
        </div>

        {/* Category pills */}
        <div className="ac-cats">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`ac-cat${activeCategory === c ? " active" : ""}`}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="ac-search-wrap">
          <span className="ac-search-icon">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="white" strokeWidth="1.5" />
              <path d="M10.5 10.5L14 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <input
            className="ac-search"
            type="text"
            placeholder="Search by title, tracking number, location, or citizen…"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </div>

        {/* States */}
        {loading && <div className="ac-loading">Loading reports…</div>}
        {error   && <div className="ac-error">⚠ {error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="ac-empty">No reports match the current filters.</div>
        )}

        {/* Cards */}
        {filtered.map((issue: Report) => {
          const meta: StatusMeta = STATUS_META[issue.status] ?? {
            color: "#fff",
            bg: "rgba(255,255,255,0.08)",
            label: issue.status,
          };
          return (
            <div className="ac-card" key={issue._id} onClick={() => openModal(issue)}>
              <div className="ac-card-top">
                <div>
                  <div className="ac-card-id">{issue.trackingNumber}</div>
                  <div className="ac-card-title">{issue.title}</div>
                </div>
                <span className="ac-badge" style={{ background: meta.bg, color: meta.color }}>
                  <span className="ac-badge-dot" />
                  {meta.label}
                </span>
              </div>

              <div className="ac-meta">
                <span><b>Category:</b> {issue.category}</span>
                <span>
                  <b>Urgency:</b>{" "}
                  <span style={{ color: URGENCY_COLOR[issue.urgency] ?? "rgba(255,255,255,0.4)" }}>
                    {issue.urgency}
                  </span>
                </span>
                <span><b>Location:</b> {issue.location}</span>
                <span><b>By:</b> {issue.submittedBy || "Anonymous"}</span>
              </div>

              <div className="ac-desc">{parseDescription(issue.description ?? "").base}</div>

              <div className="ac-card-footer">
                <span>Filed {formatDate(issue.createdAt)}</span>
                <button
                  className="ac-manage-btn"
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); openModal(issue); }}
                >
                  Manage →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal ── */}
      {modalOpen && selected && (
        <div
          className="ac-overlay"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="ac-modal">
            <button className="ac-modal-close" onClick={closeModal}>✕</button>

            <div className="ac-modal-id">{selected.trackingNumber}</div>
            <div className="ac-modal-title">{selected.title}</div>

            {/* Info grid */}
            <div className="ac-modal-section">
              <div className="ac-modal-label">Report Details</div>
              <div className="ac-modal-info-grid">
                {(
                  [
                    ["Category",       selected.category],
                    ["Location",       selected.location],
                    ["Urgency",        selected.urgency],
                    ["Submitted By",   selected.submittedBy || "Anonymous"],
                    ["Filed On",       formatDate(selected.createdAt)],
                    ["Current Status", STATUS_META[selected.status]?.label ?? selected.status],
                  ] as [string, string][]
                ).map(([k, v]) => (
                  <div className="ac-modal-info-item" key={k}>
                    <div className="ac-modal-info-key">{k}</div>
                    <div
                      className="ac-modal-info-val"
                      style={
                        k === "Urgency"
                          ? { color: URGENCY_COLOR[v] ?? "rgba(255,255,255,0.8)" }
                          : k === "Current Status"
                          ? { color: STATUS_META[selected.status]?.color ?? "#fff" }
                          : {}
                      }
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="ac-modal-section">
              <div className="ac-modal-label">Description</div>
              <div className="ac-modal-desc">{modalBase || "No description provided."}</div>
            </div>

            {/* Activity log */}
            {modalLogs.length > 0 && (
              <div className="ac-modal-section">
                <div className="ac-modal-label">Activity Log</div>
                <div className="ac-log">
                  {modalLogs.map((log: LogEntry, i: number) => (
                    <div className="ac-log-item" key={i}>
                      <span className={`ac-log-type-badge ac-log-type-${log.type}`}>{log.type}</span>
                      <div className="ac-log-body">
                        <div className="ac-log-text">{log.text}</div>
                        {log.time && <div className="ac-log-time">{log.time}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <hr className="ac-divider" />

            {/* Status change */}
            <div className="ac-modal-section">
              <div className="ac-modal-label">Update Status</div>
              <div className="ac-status-row">
                {(["pending", "in-progress", "resolved"] as const).map((s) => {
                  const m: StatusMeta = STATUS_META[s];
                  const isChosen = newStatus === s;
                  return (
                    <button
                      key={s}
                      className="ac-status-opt"
                      onClick={() => setNewStatus(s)}
                      style={{
                        background:  isChosen ? m.bg    : "transparent",
                        borderColor: isChosen ? m.color : "rgba(255,255,255,0.1)",
                        color:       isChosen ? m.color : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment */}
            <div className="ac-modal-section">
              <div className="ac-modal-label">Add Admin Comment</div>
              <textarea
                className="ac-textarea"
                placeholder="Leave a note or update for this report…"
                value={comment}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
              />
            </div>

            {/* Save bar */}
            <div className="ac-save-bar">
              <button
                className={`ac-delete-btn${deleteConfirm ? " confirm" : ""}`}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : deleteConfirm ? "Confirm Delete?" : "Delete Report"}
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" as const }}>
                <span className={`ac-save-msg${saveMsg.includes("success") ? " ok" : saveMsg ? " err" : ""}`}>
                  {saveMsg}
                </span>
                {deleteConfirm && (
                  <button
                    className="ac-save-btn"
                    style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }}
                    onClick={() => setDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                )}
                <button className="ac-save-btn" onClick={handleSave} disabled={saving || deleteConfirm}>
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}