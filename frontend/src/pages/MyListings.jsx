import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../constants";

export default function MyListings() {
  const { user, getToken, logout } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchMyListings();
  }, [user]);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(`${API_BASE}/listings/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setListings(data.listings || []);
    } catch {
      setError("Failed to load your listings.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      setDeletingId(id);
      const token = await getToken();
      await fetch(`${API_BASE}/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setListings(prev => prev.filter(l => l.id !== id));
    } catch {
      alert("Failed to delete listing. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IE", {
    day: "numeric", month: "short", year: "numeric"
  }) : "—";

  return (
    <div style={{
      minHeight: "calc(100vh - 68px)", background: "#F7F7F7",
      padding: "40px 16px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <Helmet><title>My Listings — BookMyRoom</title></Helmet>
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ maxWidth: "800px", margin: "0 auto", animation: "fadeUp 0.5s ease both" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{
              margin: "0 0 4px", fontSize: "clamp(22px, 5vw, 28px)",
              fontWeight: "800", color: "#222", fontFamily: "Georgia, serif"
            }}>
              My Listings
            </h1>
            <p style={{ margin: 0, fontSize: "14px", color: "#717171" }}>
              {user?.email}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <a href="/submit" style={{
              background: "linear-gradient(135deg, #FF385C, #E31C5F)",
              color: "white", textDecoration: "none",
              borderRadius: "24px", padding: "10px 18px",
              fontSize: "13px", fontWeight: "600",
              boxShadow: "0 4px 12px rgba(255,56,92,0.3)"
            }}>
              + Post a Room
            </a>
            <button onClick={handleLogout} style={{
              background: "white", color: "#717171",
              border: "1.5px solid #EBEBEB", borderRadius: "24px",
              padding: "10px 18px", fontSize: "13px", fontWeight: "600",
              cursor: "pointer", fontFamily: "inherit"
            }}>
              Log out
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#717171" }}>
            Loading your listings...
          </div>
        ) : error ? (
          <div style={{
            background: "#FFF1F2", border: "1px solid #FFD6DC",
            borderRadius: "12px", padding: "16px", color: "#E31C5F"
          }}>
            {error}
          </div>
        ) : listings.length === 0 ? (
          <div style={{
            background: "white", borderRadius: "20px",
            border: "1px solid #EBEBEB", padding: "60px 20px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏠</div>
            <h3 style={{ margin: "0 0 8px", color: "#222", fontSize: "18px" }}>
              No listings yet
            </h3>
            <p style={{ color: "#717171", margin: "0 0 20px", fontSize: "14px" }}>
              Post your first room and it will appear here.
            </p>
            <a href="/submit" style={{
              background: "#FF385C", color: "white", textDecoration: "none",
              borderRadius: "24px", padding: "12px 24px",
              fontSize: "14px", fontWeight: "600"
            }}>
              Post a Room
            </a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {listings.map(listing => (
              <div key={listing.id} style={{
                background: "white", borderRadius: "16px",
                border: "1px solid #EBEBEB",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                padding: "20px",
                display: "flex", justifyContent: "space-between",
                alignItems: "center", gap: "16px", flexWrap: "wrap"
              }}>
                {/* Left: listing info */}
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#222" }}>
                      {listing.title}
                    </h3>
                    <span style={{
                      background: listing.is_active ? "#F0FDF4" : "#F7F7F7",
                      color: listing.is_active ? "#16A34A" : "#717171",
                      fontSize: "11px", fontWeight: "600",
                      padding: "2px 8px", borderRadius: "20px"
                    }}>
                      {listing.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#717171" }}>
                    📍 {listing.location || listing.dublin_area} · €{listing.price}/mo
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#AAAAAA" }}>
                    Posted {formatDate(listing.created_at)} · Expires {formatDate(listing.expires_at)}
                  </p>
                </div>

                {/* Right: actions */}
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <a
                    href={`/listings/${listing.id}`}
                    style={{
                      background: "white", color: "#484848",
                      textDecoration: "none", border: "1.5px solid #EBEBEB",
                      borderRadius: "10px", padding: "8px 14px",
                      fontSize: "13px", fontWeight: "600"
                    }}
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleDelete(listing.id)}
                    disabled={deletingId === listing.id}
                    style={{
                      background: deletingId === listing.id ? "#F7F7F7" : "#FFF1F2",
                      color: "#E31C5F", border: "1.5px solid #FFD6DC",
                      borderRadius: "10px", padding: "8px 14px",
                      fontSize: "13px", fontWeight: "600",
                      cursor: deletingId === listing.id ? "not-allowed" : "pointer",
                      fontFamily: "inherit"
                    }}
                  >
                    {deletingId === listing.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}