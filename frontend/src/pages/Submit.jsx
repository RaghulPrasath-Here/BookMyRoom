import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../constants";
import { Helmet } from 'react-helmet-async'

const SAMPLE_LISTING = `Dublin 12, Permanent Sharing Accommodation Available (Double bed room with separate toilet) for a Female. Sharing room with a female student 🏠 preferably working professionals, 🚨 Move-in Date: Immediate. 🏢 2 BHK Apartment with 2 DOUBLE Bed Rooms and 2 Bathrooms kitchen and Balcony 📍 Location: within sight from Bluebell Luas stop 💰 Rent: €650 + bills 💰 Deposit: €500 (Refundable) 🚈 2-minute walk to Bluebell Luas stop ☎️ +353***46137`;

export default function Submit() {
  const navigate = useNavigate();
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleParse = async () => {
    if (!rawText.trim()) {
      setError("Please paste a listing first.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/listings/parse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_text: rawText })
      });

      if (!res.ok) throw new Error("Failed to parse listing");

      const data = await res.json();
      navigate("/confirm", { state: { parsed: data.parsed, raw_text: rawText } });
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 80px)",
      background: "#F7F7F7",
      padding: "48px 24px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
  <Helmet>
  <title>Post a Room — BookMyRoom</title>
  <meta name="description" content="Post your Dublin accommodation listing. Paste your WhatsApp message and AI will do the rest." />
  </Helmet>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        textarea:focus { outline: none; border-color: #FF385C !important; box-shadow: 0 0 0 3px rgba(255,56,92,0.1) !important; }
      `}</style>

      <div style={{
        maxWidth: "680px", margin: "0 auto",
        animation: "fadeUp 0.5s ease both"
      }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <a href="/" style={{
            textDecoration: "none", color: "#717171",
            fontSize: "14px", display: "inline-flex",
            alignItems: "center", gap: "6px", marginBottom: "20px"
          }}>
            ← Back to listings
          </a>
          <h1 style={{
            margin: "0 0 8px", fontSize: "32px",
            fontWeight: "800", color: "#222222",
            fontFamily: "Georgia, serif"
          }}>
            Post a Room
          </h1>
        </div>

        {/* Main card */}
        <div style={{
          background: "white", borderRadius: "20px",
          border: "1px solid #EBEBEB",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          overflow: "hidden"
        }}>

          {/* How it works banner */}
          <div style={{
            background: "linear-gradient(135deg, #FFF1F2, #FFF8F0)",
            borderBottom: "1px solid #FFE4E8",
            padding: "16px 24px",
            display: "flex", gap: "24px", flexWrap: "wrap"
          }}>
            {[
              { num: "1", text: "Describe your room" },
              { num: "2", text: "AI extracts the details" },
              { num: "3", text: "Review & publish" }
            ].map((step, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center",
                gap: "8px", fontSize: "13px",
                fontWeight: "600", color: "#484848"
              }}>
                <span style={{
                  width: "22px", height: "22px",
                  background: "#FF385C", color: "white",
                  borderRadius: "50%", fontSize: "12px",
                  display: "inline-flex", alignItems: "center",
                  justifyContent: "center", fontWeight: "700",
                  flexShrink: 0
                }}>{step.num}</span>
                {step.text}
                {i < 2 && <span style={{ color: "#CCCCCC", marginLeft: "8px" }}>→</span>}
              </div>
            ))}
          </div>

          <div style={{ padding: "24px" }}>

            {/* Textarea */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block", fontSize: "13px",
                fontWeight: "700", color: "#222",
                marginBottom: "8px", textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Your Listing
              </label>
              <textarea
                value={rawText}
                onChange={e => { setRawText(e.target.value); setError(null); }}
                placeholder="Describe about your accomodation...&#10;&#10;e.g. Dublin 12, Double room available for Female. Rent €650 + bills. Near Bluebell Luas. Contact: +353..."
                rows={10}
                style={{
                  width: "100%", padding: "16px",
                  border: "1.5px solid #EBEBEB",
                  borderRadius: "12px", fontSize: "15px",
                  color: "#222", background: "#FAFAFA",
                  resize: "vertical", lineHeight: "1.7",
                  fontFamily: "inherit", transition: "border-color 0.2s, box-shadow 0.2s",
                  boxSizing: "border-box"
                }}
              />
              <div style={{
                display: "flex", justifyContent: "space-between",
                marginTop: "6px"
              }}>
                <span style={{ fontSize: "12px", color: "#AAAAAA" }}>
                  Supports emojis, mixed languages, any format
                </span>
                <span style={{
                  fontSize: "12px",
                  color: rawText.length > 2000 ? "#FF385C" : "#AAAAAA"
                }}>
                  {rawText.length} chars
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "#FFF1F2", border: "1px solid #FFD6DC",
                borderRadius: "10px", padding: "12px 16px",
                color: "#E31C5F", fontSize: "14px",
                marginBottom: "16px", display: "flex",
                alignItems: "center", gap: "8px"
              }}>
                {error}
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={handleParse}
                disabled={loading || !rawText.trim()}
                style={{
                  flex: 1, minWidth: "200px",
                  background: loading || !rawText.trim()
                    ? "#CCCCCC"
                    : "linear-gradient(135deg, #FF385C, #E31C5F)",
                  color: "white", border: "none",
                  borderRadius: "12px", padding: "16px 24px",
                  fontSize: "16px", fontWeight: "700",
                  cursor: loading || !rawText.trim() ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "10px",
                  transition: "opacity 0.2s",
                  boxShadow: loading || !rawText.trim()
                    ? "none"
                    : "0 4px 16px rgba(255,56,92,0.3)",
                  fontFamily: "inherit"
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: "18px", height: "18px",
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "white", borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                      flexShrink: 0
                    }} />
                    AI is reading your listing...
                  </>
                ) : (
                  <>Parse with AI →</>
                )}
              </button>

              <button
                onClick={() => setRawText("")}
                disabled={!rawText.trim()}
                style={{
                  background: "none",
                  border: "1.5px solid #EBEBEB",
                  borderRadius: "12px", padding: "16px 20px",
                  fontSize: "14px", fontWeight: "600",
                  color: "#717171", cursor: !rawText.trim() ? "not-allowed" : "pointer",
                  fontFamily: "inherit"
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Sample listing */}
        <div style={{
          marginTop: "24px", background: "white",
          borderRadius: "16px", border: "1px solid #EBEBEB",
          padding: "20px 24px"
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: "12px"
          }}>
            <p style={{
              margin: 0, fontSize: "13px",
              fontWeight: "700", color: "#484848",
              textTransform: "uppercase", letterSpacing: "0.5px"
            }}>
              Try a sample listing
            </p>
            <button
              onClick={() => setRawText(SAMPLE_LISTING)}
              style={{
                background: "#FFF1F2", color: "#FF385C",
                border: "1px solid #FFD6DC", borderRadius: "20px",
                padding: "6px 14px", fontSize: "12px",
                fontWeight: "600", cursor: "pointer",
                fontFamily: "inherit"
              }}
            >
              Use sample →
            </button>
          </div>
          <p style={{
            margin: 0, fontSize: "13px", color: "#717171",
            lineHeight: "1.6", fontStyle: "italic",
            overflow: "hidden", display: "-webkit-box",
            WebkitLineClamp: 3, WebkitBoxOrient: "vertical"
          }}>
            {SAMPLE_LISTING}
          </p>
        </div>

        {/* Trust note */}
        <p style={{
          textAlign: "center", fontSize: "12px",
          color: "#AAAAAA", marginTop: "20px", lineHeight: "1.6"
        }}>
          Your listing will be identified by your contact number.<br />
          To remove a listing, contact us.
        </p>
      </div>
    </div>
  );
}