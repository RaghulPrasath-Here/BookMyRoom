import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, title } = location.state || {};
  const [copied, setCopied] = useState(false);

  const listingUrl = `${window.location.origin}/listings/${id}`;

  useEffect(() => {
    if (!id) navigate("/");
  }, [id, navigate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(listingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 80px)",
      background: "#F7F7F7",
      display: "flex", alignItems: "center",
      justifyContent: "center", padding: "40px 24px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        maxWidth: "520px", width: "100%",
        textAlign: "center",
        animation: "fadeUp 0.5s ease both"
      }}>

        {/* Success icon */}
        <div style={{
          width: "88px", height: "88px",
          background: "linear-gradient(135deg, #16A34A, #22C55E)",
          borderRadius: "50%", margin: "0 auto 24px",
          display: "flex", alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 32px rgba(22,163,74,0.3)",
          animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both"
        }}>
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24"
            stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        {/* Heading */}
        <h1 style={{
          margin: "0 0 10px", fontSize: "32px",
          fontWeight: "800", color: "#222",
          fontFamily: "Georgia, serif"
        }}>
          Your listing is live!
        </h1>
        <p style={{
          margin: "0 0 32px", fontSize: "16px",
          color: "#717171", lineHeight: "1.6"
        }}>
          {title ? `"${title}" is` : "Your room"} now searchable on BookMyRoom.<br />
          Share the link below to get more eyes on it.
        </p>

        {/* Share card */}
        <div style={{
          background: "white", borderRadius: "16px",
          border: "1px solid #EBEBEB",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          padding: "20px", marginBottom: "24px"
        }}>
          <p style={{
            margin: "0 0 12px", fontSize: "12px",
            fontWeight: "700", color: "#717171",
            textTransform: "uppercase", letterSpacing: "0.5px"
          }}>
            Listing Link
          </p>
          <div style={{
            display: "flex", gap: "8px", alignItems: "center"
          }}>
            <div style={{
              flex: 1, background: "#F7F7F7",
              border: "1.5px solid #EBEBEB",
              borderRadius: "10px", padding: "12px 14px",
              fontSize: "13px", color: "#484848",
              overflow: "hidden", textOverflow: "ellipsis",
              whiteSpace: "nowrap", textAlign: "left"
            }}>
              {listingUrl}
            </div>
            <button
              onClick={handleCopy}
              style={{
                background: copied ? "#16A34A" : "#222",
                color: "white", border: "none",
                borderRadius: "10px", padding: "12px 18px",
                fontSize: "13px", fontWeight: "600",
                cursor: "pointer", fontFamily: "inherit",
                transition: "background 0.2s", whiteSpace: "nowrap"
              }}
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href={`/listings/${id}`}
            style={{
              background: "linear-gradient(135deg, #FF385C, #E31C5F)",
              color: "white", textDecoration: "none",
              borderRadius: "12px", padding: "14px 28px",
              fontSize: "15px", fontWeight: "700",
              boxShadow: "0 4px 16px rgba(255,56,92,0.3)"
            }}
          >
            View your listing
          </a>
          <a
            href="/submit"
            style={{
              background: "white", color: "#222",
              textDecoration: "none", borderRadius: "12px",
              padding: "14px 28px", fontSize: "15px",
              fontWeight: "700", border: "1.5px solid #EBEBEB"
            }}
          >
            Post another room
          </a>
        </div>

        {/* Back to home */}
        <a href="/" style={{
          display: "block", marginTop: "24px",
          fontSize: "14px", color: "#AAAAAA",
          textDecoration: "none"
        }}>
          ← Back to home
        </a>
      </div>
    </div>
  );
}