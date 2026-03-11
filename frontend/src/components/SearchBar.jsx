import { useState } from "react";

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch({ query });
  };

  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
      display: "flex", alignItems: "stretch",
      overflow: "hidden",
      border: "1px solid #EBEBEB",
      maxWidth: "700px", width: "100%",
    }}>
      <div style={{ flex: 1, padding: "16px 20px" }}>
        <div style={{
          fontSize: "11px", fontWeight: "700", color: "#222",
          marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px"
        }}>
          Where do you want to live?
        </div>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder="e.g. room near UCD under €600 for 3 months..."
          style={{
            border: "none", outline: "none", width: "100%",
            fontSize: "15px", color: "#484848", background: "transparent",
            fontFamily: "inherit"
          }}
        />
      </div>

      <button
        onClick={handleSearch}
        disabled={loading}
        style={{
          background: "linear-gradient(135deg, #FF385C, #E31C5F)",
          color: "white", border: "none", cursor: "pointer",
          padding: "0 28px", fontSize: "15px", fontWeight: "600",
          display: "flex", alignItems: "center", gap: "8px",
          transition: "opacity 0.2s", fontFamily: "inherit",
          minWidth: "120px", justifyContent: "center"
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        {loading ? (
          <div style={{
            width: "18px", height: "18px",
            border: "2px solid rgba(255,255,255,0.4)",
            borderTopColor: "white", borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />
        ) : (
          <>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            Search
          </>
        )}
      </button>
    </div>
  );
}