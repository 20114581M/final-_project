"use client";
import React, { useState } from "react";
import emailjs from "@emailjs/browser";

export default function ContactUS() {
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    message: "",
  });
  const [loading, setLoading]     = useState(false);
  const [status, setStatus]       = useState<"idle" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.fullName || !form.phoneNumber || !form.email || !form.message)
      return "Please fill in all fields.";
    if (!/\S+@\S+\.\S+/.test(form.email))
      return "Invalid email format.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setStatus("error"); setStatusMsg(err); return; }

    setLoading(true);
    setStatus("idle");
    setStatusMsg("");

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAIL_SERVICE_ID,
        import.meta.env.VITE_EMAIL_TEMPLATE_ID,
        {
          from_name:  form.fullName,
          from_email: form.email,
          phone:      form.phoneNumber,
          message:    form.message,
        },
        import.meta.env.VITE_EMAIL_PUBLIC_KEY
      );

      setStatus("success");
      setStatusMsg("Message sent! We'll get back to you soon.");
      setForm({ fullName: "", phoneNumber: "", email: "", message: "" });
    } catch {
      setStatus("error");
      setStatusMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" style={{
      width: "100%",
      padding: "80px 60px",
      color: "#ffffff",
      fontFamily: "'Jost', sans-serif",
      boxSizing: "border-box",

      borderTop: "0.5px solid rgba(19,229,19,0.12)",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fauna+One&family=Cinzel:wght@700;900&family=Jost:wght@400;500;600;700&display=swap');
        :root { --primary: #13e513; --accent: #d4ed17; }

        /* subtle grid texture overlay */
        #contact::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(19,229,19,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(19,229,19,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%);
        }

        /* glow blobs */
        #contact::after {
          content: '';
          position: absolute; pointer-events: none;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(19,229,19,0.04) 0%, transparent 70%);
          top: -100px; right: -100px;
        }

        .ct-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }

        .ct-outer {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: start;
        }
        .ct-left { position: sticky; top: 80px; }

        .ct-label {
          font-size: 10px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: rgba(255,255,255,0.3);
          display: block; margin-bottom: 8px;
        }
        .ct-input {
          width: 100%; padding: 12px 14px;
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.1);
          border-radius: 8px; color: #ffffff;
          font-size: 14px; font-family: 'Jost', sans-serif;
          outline: none; box-sizing: border-box;
          transition: border-color 0.15s, background 0.15s;
        }
        .ct-input:focus {
          border-color: rgba(19,229,19,0.45);
          background: rgba(19,229,19,0.05);
        }
        .ct-input::placeholder { color: rgba(255,255,255,0.18); }

        .ct-phone-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .ct-submit {
          padding: 13px 28px;
          background: var(--primary); color: #050f05;
          border: none; border-radius: 8px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; cursor: pointer;
          font-family: 'Jost', sans-serif;
          transition: background 0.15s, transform 0.1s;
        }
        .ct-submit:hover:not(:disabled) { background: #0ecf0e; transform: translateY(-1px); }
        .ct-submit:active:not(:disabled) { transform: scale(0.98); }
        .ct-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .ct-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin-top: 60px;
        }

        @media (max-width: 900px) {
          #contact { padding: 60px 32px !important; }
          .ct-outer { grid-template-columns: 1fr !important; gap: 48px !important; }
          .ct-left { position: relative !important; top: auto !important; }
        }
        @media (max-width: 480px) {
          #contact { padding: 48px 20px !important; }
          .ct-phone-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="ct-inner">
        <div className="ct-outer">

          {/* Left: info */}
          <div className="ct-left">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <span style={{
                width: "28px", height: "1px",
                background: "rgba(19,229,19,0.5)",
                display: "inline-block", flexShrink: 0,
              }} />
              <span style={{
                fontSize: "10px", letterSpacing: "0.16em",
                textTransform: "uppercase", color: "var(--primary)", fontWeight: 600,
              }}>
                Get In Touch
              </span>
            </div>

            <h2 style={{
              fontFamily: "'Cinzel', serif", fontWeight: 900,
              fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.05,
              letterSpacing: "0.02em", margin: "0 0 24px", color: "#ffffff",
            }}>
              Contact<br />
              <span style={{ color: "var(--accent)" }}>Us.</span>
            </h2>

            <p style={{
              fontFamily: "'Fauna One', serif", fontSize: "14px",
              color: "rgba(255,255,255,0.4)", lineHeight: 1.85,
              margin: "0 0 36px", maxWidth: "300px",
            }}>
              Have a concern or feedback about a reported issue? Fill out the
              form and the Baguio City Hub team will get back to you as soon as
              possible.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {[
                { icon: "📧", label: "Email",    value: "servicesjmseptember@gmail.com" },
                { icon: "📍", label: "Location", value: "Baguio City, Philippines" },
                { icon: "🕐", label: "Response", value: "Within 1–2 business days" },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "8px", flexShrink: 0,
                    background: "rgba(19,229,19,0.07)",
                    border: "0.5px solid rgba(19,229,19,0.18)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "15px",
                  }}>
                    {icon}
                  </div>
                  <div>
                    <p style={{ fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", margin: "0 0 2px" }}>{label}</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: 0, wordBreak: "break-all" }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px", paddingTop: "4px" }}>

            <div>
              <label className="ct-label">Full Name</label>
              <input className="ct-input" type="text" name="fullName"
                value={form.fullName} onChange={handleChange} placeholder="Juan dela Cruz" />
            </div>

            <div className="ct-phone-row">
              <div>
                <label className="ct-label">Phone Number</label>
                <input className="ct-input" type="tel" name="phoneNumber"
                  value={form.phoneNumber} onChange={handleChange} placeholder="+63 912 345 6789" />
              </div>
              <div>
                <label className="ct-label">Email</label>
                <input className="ct-input" type="email" name="email"
                  value={form.email} onChange={handleChange} placeholder="juan@email.com" />
              </div>
            </div>

            <div>
              <label className="ct-label">Message</label>
              <textarea className="ct-input" name="message"
                value={form.message} onChange={handleChange}
                placeholder="Tell us about your concern or inquiry…"
                rows={5} style={{ resize: "vertical", lineHeight: 1.7 }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
              <button type="submit" className="ct-submit" disabled={loading}>
                {loading ? "Sending…" : "Send Message ↗"}
              </button>

              {status !== "idle" && (
                <p style={{
                  margin: 0, fontSize: "12px",
                  color: status === "success" ? "var(--primary)" : "#ff6b6b",
                }}>
                  {statusMsg}
                </p>
              )}
            </div>

          </form>
        </div>

        <div className="ct-divider" />
      </div>
    </section>
  );
}