import { useState } from "react";

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => onSearch({ query });

  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
      display: "flex", alignItems: "stretch",
      overflow: "hidden",
      border: "1px solid #EBEBEB",
      width: "100%", maxWidth: "700px",
    }}>
      <div style={{ flex: 1, padding: "14px 16px" }}>
        <div style={{
          fontSize: "10px", fontWeight: "700", color: "#222",
          marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px"
        }}>
          Where do you want to live?
        </div>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder="e.g. room near UCD under €600..."
          style={{
            border: "none", outline: "none", width: "100%",
            fontSize: "14px", color: "#484848", background: "transparent",
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
          padding: "0 20px", fontSize: "14px", fontWeight: "600",
          display: "flex", alignItems: "center", gap: "6px",
          fontFamily: "inherit", minWidth: "90px", justifyContent: "center",
          flexShrink: 0
        }}
      >
        {loading ? (
          <div style={{
            width: "16px", height: "16px",
            border: "2px solid rgba(255,255,255,0.4)",
            borderTopColor: "white", borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />
        ) : (
          <>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            Search
          </>
        )}
      </button>
    </div>
  );
}