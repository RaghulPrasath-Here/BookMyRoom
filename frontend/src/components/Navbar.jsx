export default function Navbar() {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "white",
      borderBottom: "1px solid #EBEBEB",
      padding: "0 24px",
      height: "80px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 1px 12px rgba(0,0,0,0.08)"
    }}>
      <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z" fill="#FF385C"/>
          <path d="M16 7c-1.5 0-2.8.6-3.8 1.5L8 13v10h4v-6h8v6h4V13l-4.2-4.5C18.8 7.6 17.5 7 16 7z" fill="white"/>
        </svg>
        <span style={{ fontSize: "20px", fontWeight: "700", color: "#FF385C", fontFamily: "Georgia, serif" }}>
          BookMyRoom
        </span>
      </a>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <a
          href="/browse"
          style={{
            textDecoration: "none", color: "#222222",
            fontSize: "14px", fontWeight: "600",
            padding: "8px 16px", borderRadius: "24px",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => e.target.style.background = "#F7F7F7"}
          onMouseLeave={e => e.target.style.background = "transparent"}
        >
          Browse
        </a>
        <a
          href="/submit"
          style={{
            textDecoration: "none",
            background: "linear-gradient(135deg, #FF385C, #E31C5F)",
            color: "white", fontSize: "14px", fontWeight: "600",
            padding: "12px 20px", borderRadius: "24px",
            boxShadow: "0 4px 12px rgba(255,56,92,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s",
            display: "flex", alignItems: "center", gap: "6px"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(255,56,92,0.4)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(255,56,92,0.3)";
          }}
        >
          + Post a Room
        </a>
      </div>
    </nav>
  );
}