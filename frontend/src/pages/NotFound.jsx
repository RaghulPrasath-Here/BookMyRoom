import { Helmet } from 'react-helmet-async'

export default function NotFound() {
  return (
    <div style={{
      minHeight: "calc(100vh - 80px)",
      background: "#F7F7F7",
      display: "flex", alignItems: "center",
      justifyContent: "center", padding: "40px 24px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      textAlign: "center"
    }}>

  <Helmet>
    <title>Page Not Found — BookMyRoom</title>
  </Helmet>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>

      <div style={{ animation: "fadeUp 0.5s ease both" }}>

        {/* Illustration */}
        <div style={{
          fontSize: "80px", marginBottom: "8px",
          animation: "float 3s ease-in-out infinite"
        }}>
          🏚️
        </div>

        <div style={{
          fontSize: "13px", fontWeight: "700",
          color: "#FF385C", marginBottom: "12px",
          textTransform: "uppercase", letterSpacing: "1px"
        }}>
          404 — Page not found
        </div>

        <h1 style={{
          margin: "0 0 12px", fontSize: "32px",
          fontWeight: "800", color: "#222",
          fontFamily: "Georgia, serif"
        }}>
          This room has gone!
        </h1>

        <p style={{
          margin: "0 0 32px", fontSize: "16px",
          color: "#717171", lineHeight: "1.6",
          maxWidth: "360px"
        }}>
          The page you're looking for doesn't exist or the listing may have expired.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="/"
            style={{
              background: "linear-gradient(135deg, #FF385C, #E31C5F)",
              color: "white", textDecoration: "none",
              borderRadius: "12px", padding: "14px 28px",
              fontSize: "15px", fontWeight: "700",
              boxShadow: "0 4px 16px rgba(255,56,92,0.3)"
            }}
          >
            Browse listings
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
            Post a room
          </a>
        </div>
      </div>
    </div>
  );
}