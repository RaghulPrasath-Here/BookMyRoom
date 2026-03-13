import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
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

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/listings/`);
      const data = await res.json();
      setListings(data.listings || []);
    } catch {
      setError("Failed to load listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async ({ query }) => {
    if (!query.trim()) return fetchListings();
    try {
      setSearchLoading(true);
      setIsSearching(true);
      setSearchQuery(query);
      const res = await fetch(`${API_BASE}/search/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setListings(data.results || []);
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setSearchLoading(false);
    }
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
      `}</style>

      {/* <Navbar /> */}

      {/* Hero */}
      <div style={{
        background: "linear-gradient(160deg, #FFF1F2 0%, #FFFFFF 50%, #FFF8F0 100%)",
        padding: "80px 24px",
        textAlign: "center",
        borderBottom: "1px solid #EBEBEB",
        animation: "fadeUp 0.6s ease both"
      }}>
        <div style={{ marginBottom: "12px" }}>
          <span style={{
            background: "#FFF1F2", color: "#FF385C",
            fontSize: "13px", fontWeight: "600",
            padding: "6px 16px", borderRadius: "20px",
            border: "1px solid #FFD6DC"
          }}>
            🇮🇪 Dublin's accommodation marketplace
          </span>
        </div>

        <h1 style={{
          fontSize: "clamp(32px, 5vw, 56px)",
          fontWeight: "800", color: "#222222",
          margin: "16px 0 12px", lineHeight: "1.15",
          fontFamily: "Georgia, 'Times New Roman', serif",
          letterSpacing: "-1px"
        }}>
          Find your perfect<br />
          <span style={{ color: "#FF385C" }}>room in Dublin</span>
        </h1>

        <p style={{
          fontSize: "18px", color: "#717171",
          margin: "0 auto 40px", maxWidth: "500px", lineHeight: "1.6"
        }}>
          Real listings from WhatsApp & Facebook groups,<br />searchable in one place
        </p>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <SearchBar onSearch={handleSearch} loading={searchLoading} />
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", justifyContent: "center",
          gap: "40px", marginTop: "40px", flexWrap: "wrap"
        }}>
          {[
            { label: "Active Listings", value: listings.length || "—" },
            { label: "Dublin Areas", value: "24+" },
            { label: "AI Powered", value: "✓" }
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#222" }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "#717171" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Listings */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "24px"
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "#222" }}>
              {isSearching ? `Results for "${searchQuery}"` : "Latest Listings"}
            </h2>
            {!loading && (
              <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#717171" }}>
                {listings.length} {listings.length === 1 ? "room" : "rooms"} found
              </p>
            )}
          </div>
          {isSearching && (
            <button
              onClick={() => { setIsSearching(false); fetchListings(); }}
              style={{
                background: "none", border: "1px solid #EBEBEB",
                borderRadius: "24px", padding: "8px 16px",
                fontSize: "13px", fontWeight: "600",
                color: "#484848", cursor: "pointer"
              }}
            >
              ✕ Clear search
            </button>
          )}
        </div>

        {error && (
          <div style={{
            background: "#FFF1F2", border: "1px solid #FFD6DC",
            borderRadius: "12px", padding: "16px 20px",
            color: "#E31C5F", marginBottom: "24px",
            display: "flex", alignItems: "center", gap: "10px"
          }}>
            <span>⚠️</span> {error}
            <button onClick={fetchListings} style={{
              marginLeft: "auto", background: "#FF385C",
              color: "white", border: "none", borderRadius: "8px",
              padding: "6px 14px", fontSize: "13px", cursor: "pointer"
            }}>Retry</button>
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "24px"
        }}>
          {loading ? (
            Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : listings.length > 0 ? (
            listings.map((listing, i) => (
              <div key={listing.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.05}s both` }}>
                <ListingCard listing={listing} />
              </div>
            ))
          ) : (
            <div style={{
              gridColumn: "1 / -1", textAlign: "center", padding: "80px 20px"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏠</div>
              <h3 style={{ color: "#222", fontSize: "20px", margin: "0 0 8px" }}>No rooms found</h3>
              <p style={{ color: "#717171", margin: "0 0 24px" }}>
                {isSearching ? "Try a different search" : "Be the first to post a listing!"}
              </p>
              <a href="/submit" style={{
                background: "#FF385C", color: "white",
                textDecoration: "none", padding: "12px 24px",
                borderRadius: "24px", fontSize: "14px", fontWeight: "600"
              }}>
                + Post a Room
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #EBEBEB", background: "white",
        padding: "32px 24px", textAlign: "center",
        color: "#717171", fontSize: "13px"
      }}>
        <p style={{ margin: 0 }}>© 2026 BookMyRoom · Made for Dublin's rental community 🇮🇪</p>
      </footer>
    </div>
  );
}