export default function Navbar() {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "white",
      borderBottom: "1px solid #EBEBEB",
      padding: "0 16px",
      height: "68px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 1px 12px rgba(0,0,0,0.08)"
    }}>
      <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z" fill="#FF385C"/>
          <path d="M16 7c-1.5 0-2.8.6-3.8 1.5L8 13v10h4v-6h8v6h4V13l-4.2-4.5C18.8 7.6 17.5 7 16 7z" fill="white"/>
        </svg>
        <span style={{
          fontSize: "18px", fontWeight: "700",
          color: "#FF385C", fontFamily: "Georgia, serif"
        }}>
          BookMyRoom
        </span>
      </a>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <a
          href="/browse"
          style={{
            textDecoration: "none", color: "#222222",
            fontSize: "14px", fontWeight: "600",
            padding: "8px 12px", borderRadius: "24px",
          }}
        >
          Browse
        </a>
        <a
          href="/submit"
          style={{
            textDecoration: "none",
            background: "linear-gradient(135deg, #FF385C, #E31C5F)",
            color: "white", fontSize: "13px", fontWeight: "600",
            padding: "10px 16px", borderRadius: "24px",
            boxShadow: "0 4px 12px rgba(255,56,92,0.3)",
            display: "flex", alignItems: "center", gap: "4px",
            whiteSpace: "nowrap"
          }}
        >
          + Post a Room
        </a>
      </div>
    </nav>
  );
}