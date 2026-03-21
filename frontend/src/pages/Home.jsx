import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import ListingCard from "../components/ListingCard";
import SkeletonCard from "../components/SkeletonCard";
import { API_BASE } from "../constants";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { fetchListings(); }, []);

  const fetchListings = async () => {
    try {
      setLoading(true); setError(null);
      const res = await fetch(`${API_BASE}/listings/`);
      const data = await res.json();
      setListings(data.listings || []);
    } catch { setError("Failed to load listings."); }
    finally { setLoading(false); }
  };

  const handleSearch = async ({ query }) => {
    if (!query.trim()) return fetchListings();
    try {
      setSearchLoading(true); setIsSearching(true); setSearchQuery(query);
      const res = await fetch(`${API_BASE}/search/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setListings(data.results || []);
    } catch { setError("Search failed."); }
    finally { setSearchLoading(false); }
  };

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: "#F7F7F7", minHeight: "100vh"
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        .listings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        @media (max-width: 600px) {
          .listings-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(160deg, #FFF1F2 0%, #FFFFFF 50%, #FFF8F0 100%)",
        padding: "clamp(40px, 8vw, 80px) 16px 48px",
        textAlign: "center", borderBottom: "1px solid #EBEBEB",
        animation: "fadeUp 0.6s ease both"
      }}>
        <span style={{
          background: "#FFF1F2", color: "#FF385C", fontSize: "12px",
          fontWeight: "600", padding: "5px 14px", borderRadius: "20px",
          border: "1px solid #FFD6DC", display: "inline-block"
        }}>
          🇮🇪 Dublin's accommodation marketplace
        </span>

        <h1 style={{
          fontSize: "clamp(28px, 7vw, 56px)", fontWeight: "800",
          color: "#222222", margin: "16px 0 12px", lineHeight: "1.15",
          fontFamily: "Georgia, serif", letterSpacing: "-1px"
        }}>
          Find your perfect<br />
          <span style={{ color: "#FF385C" }}>room in Dublin</span>
        </h1>

        <p style={{
          fontSize: "clamp(14px, 3vw, 18px)", color: "#717171",
          margin: "0 auto 28px", maxWidth: "480px", lineHeight: "1.6"
        }}>
          Real listings from WhatsApp & Facebook groups,
          searchable in one place
        </p>

        <div style={{ display: "flex", justifyContent: "center", padding: "0 4px" }}>
          <SearchBar onSearch={handleSearch} loading={searchLoading} />
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", justifyContent: "center",
          gap: "clamp(16px, 6vw, 48px)", marginTop: "28px", flexWrap: "wrap"
        }}>
          {[
            { label: "Active Listings", value: listings.length || "—" },
            { label: "Dublin Areas", value: "24+" },
            { label: "AI Powered", value: "✓" }
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(18px, 4vw, 24px)", fontWeight: "700", color: "#222" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "12px", color: "#717171" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Listings section */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 16px" }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "18px",
          flexWrap: "wrap", gap: "8px"
        }}>
          <div>
            <h2 style={{
              margin: 0, fontSize: "clamp(17px, 4vw, 22px)",
              fontWeight: "700", color: "#222"
            }}>
              {isSearching ? `Results for "${searchQuery}"` : "Latest Listings"}
            </h2>
            {!loading && (
              <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#717171" }}>
                {listings.length} {listings.length === 1 ? "room" : "rooms"} found
              </p>
            )}
          </div>
          {isSearching && (
            <button
              onClick={() => { setIsSearching(false); fetchListings(); }}
              style={{
                background: "none", border: "1px solid #EBEBEB",
                borderRadius: "24px", padding: "7px 14px",
                fontSize: "13px", fontWeight: "600",
                color: "#484848", cursor: "pointer"
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        {error && (
          <div style={{
            background: "#FFF1F2", border: "1px solid #FFD6DC",
            borderRadius: "12px", padding: "14px 16px",
            color: "#E31C5F", marginBottom: "18px",
            display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: "10px", flexWrap: "wrap"
          }}>
            <span style={{ fontSize: "14px" }}>{error}</span>
            <button onClick={fetchListings} style={{
              background: "#FF385C", color: "white", border: "none",
              borderRadius: "8px", padding: "6px 14px",
              fontSize: "13px", cursor: "pointer"
            }}>Retry</button>
          </div>
        )}

        <div className="listings-grid">
          {loading ? (
            Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : listings.length > 0 ? (
            listings.map((listing, i) => (
              <div key={listing.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.05}s both` }}>
                <ListingCard listing={listing} />
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 16px" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏠</div>
              <h3 style={{ color: "#222", fontSize: "18px", margin: "0 0 8px" }}>No rooms found</h3>
              <p style={{ color: "#717171", margin: "0 0 20px", fontSize: "14px" }}>
                {isSearching ? "Try a different search" : "Be the first to post!"}
              </p>
              <a href="/submit" style={{
                background: "#FF385C", color: "white", textDecoration: "none",
                padding: "12px 24px", borderRadius: "24px",
                fontSize: "14px", fontWeight: "600"
              }}>
                + Post a Room
              </a>
            </div>
          )}
        </div>
      </div>

      <footer style={{
        borderTop: "1px solid #EBEBEB", background: "white",
        padding: "24px 16px", textAlign: "center",
        color: "#717171", fontSize: "12px"
      }}>
        <p style={{ margin: 0 }}>© 2026 BookMyRoom · Made for Dublin's rental community 🇮🇪</p>
      </footer>
    </div>
  );
}