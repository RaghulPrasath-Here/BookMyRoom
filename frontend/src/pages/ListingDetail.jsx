import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_BASE } from "../constants";

function Badge({ children, bg = "#F7F7F7", color = "#484848" }) {
  return (
    <span style={{
      background: bg, color,
      fontSize: "13px", fontWeight: "600",
      padding: "6px 14px", borderRadius: "20px",
      display: "inline-flex", alignItems: "center", gap: "6px",
      border: "1px solid rgba(0,0,0,0.06)"
    }}>
      {children}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <h3 style={{
        margin: "0 0 14px", fontSize: "16px",
        fontWeight: "700", color: "#222",
        paddingBottom: "10px",
        borderBottom: "1px solid #F0F0F0"
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      alignItems: "center", padding: "12px 0",
      borderBottom: "1px solid #F7F7F7"
    }}>
      <span style={{ fontSize: "14px", color: "#717171", fontWeight: "500" }}>{label}</span>
      <span style={{ fontSize: "14px", color: "#222", fontWeight: "600", textAlign: "right", maxWidth: "60%" }}>{value}</span>
    </div>
  );
}

function SkeletonDetail() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      {[300, 200, 150, 250].map((h, i) => (
        <div key={i} style={{
          height: `${h}px`, borderRadius: "16px", marginBottom: "20px",
          background: "linear-gradient(90deg, #F0F0F0 25%, #E8E8E8 50%, #F0F0F0 75%)",
          backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite"
        }} />
      ))}
    </div>
  );
}

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactRevealed, setContactRevealed] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/listings/${id}`);
        if (!res.ok) throw new Error("Listing not found");
        const data = await res.json();
        setListing(data);
      } catch {
        setError("This listing could not be found.");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const gradientMap = {
    ensuite: "#667eea, #764ba2",
    studio: "#f093fb, #f5576c",
    double: "#4facfe, #00f2fe",
    single: "#43e97b, #38f9d7",
    shared: "#fa709a, #fee140",
  };

  const gradient = listing ? (gradientMap[listing.room_type] || "#4facfe, #00f2fe") : "#4facfe, #00f2fe";

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-IE", {
      day: "numeric", month: "long", year: "numeric"
    });
  };

  const daysAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Posted today";
    if (diff === 1) return "Posted yesterday";
    return `Posted ${diff} days ago`;
  };

  if (loading) return <SkeletonDetail />;

  if (error) {
    return (
      <div style={{
        minHeight: "calc(100vh - 80px)", display: "flex",
        alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "16px",
        fontFamily: "-apple-system, sans-serif"
      }}>
        <div style={{ fontSize: "48px" }}>🏚️</div>
        <h2 style={{ margin: 0, color: "#222" }}>Listing not found</h2>
        <p style={{ color: "#717171", margin: 0 }}>This listing may have expired or been removed.</p>
        <a href="/" style={{
          background: "#FF385C", color: "white",
          textDecoration: "none", padding: "12px 24px",
          borderRadius: "24px", fontSize: "14px", fontWeight: "600",
          marginTop: "8px"
        }}>
          Browse all listings
        </a>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "calc(100vh - 80px)",
      background: "#F7F7F7",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Hero banner */}
      <div style={{
        height: "240px",
        background: `linear-gradient(135deg, ${gradient})`,
        display: "flex", alignItems: "center",
        justifyContent: "center", position: "relative"
      }}>
        <span style={{ fontSize: "72px", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}>
          {listing.room_type === "ensuite" ? "🛁" :
           listing.room_type === "studio" ? "🏢" :
           listing.room_type === "double" ? "🛏️" : "🏠"}
        </span>

        {/* Back button */}
        <a href="/" style={{
          position: "absolute", top: "20px", left: "24px",
          textDecoration: "none", background: "rgba(255,255,255,0.95)",
          color: "#222", borderRadius: "24px", padding: "8px 16px",
          fontSize: "13px", fontWeight: "600",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          display: "flex", alignItems: "center", gap: "6px"
        }}>
          ← Back
        </a>

        {/* Days ago badge */}
        <div style={{
          position: "absolute", top: "20px", right: "24px",
          background: "rgba(255,255,255,0.95)",
          borderRadius: "20px", padding: "6px 14px",
          fontSize: "12px", fontWeight: "600", color: "#717171"
        }}>
          {daysAgo(listing.created_at)}
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: "800px", margin: "0 auto",
        padding: "0 24px 60px",
        animation: "fadeUp 0.5s ease both"
      }}>

        {/* Title card */}
        <div style={{
          background: "white", borderRadius: "20px",
          border: "1px solid #EBEBEB",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          padding: "28px", marginTop: "-40px",
          position: "relative", zIndex: 10,
          marginBottom: "20px"
        }}>
          {/* Badges row */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
            {listing.is_permanent ? (
              <Badge bg="#ECFDF5" color="#065F46">Permanent</Badge>
            ) : (
              <Badge bg="#FFF7ED" color="#92400E">{listing.duration_months} months</Badge>
            )}
            {listing.room_type && (
              <Badge bg="#FFF1F2" color="#E31C5F">
                {listing.room_type.charAt(0).toUpperCase() + listing.room_type.slice(1)}
              </Badge>
            )}
            {listing.gender_preference && listing.gender_preference !== "any" && (
              <Badge bg="#EFF6FF" color="#1D4ED8">
                {listing.gender_preference.charAt(0).toUpperCase() + listing.gender_preference.slice(1)} only
              </Badge>
            )}
            {listing.bills_included && (
              <Badge bg="#F0FDF4" color="#16A34A">Bills included</Badge>
            )}
          </div>

          <h1 style={{
            margin: "0 0 10px", fontSize: "26px",
            fontWeight: "800", color: "#222222",
            fontFamily: "Georgia, serif", lineHeight: "1.3"
          }}>
            {listing.title || "Room in Dublin"}
          </h1>

          <p style={{
            margin: "0 0 20px", fontSize: "15px",
            color: "#717171", display: "flex",
            alignItems: "center", gap: "6px"
          }}>
            <svg width="14" height="14" fill="#FF385C" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            {listing.location || listing.dublin_area || "Dublin"}
          </p>

          {/* Price row */}
          <div style={{
            display: "flex", alignItems: "baseline",
            gap: "6px", paddingTop: "16px",
            borderTop: "1px solid #F0F0F0"
          }}>
            <span style={{
              fontSize: "32px", fontWeight: "800", color: "#222"
            }}>
              €{listing.price}
            </span>
            <span style={{ fontSize: "16px", color: "#717171" }}>/month</span>
            {listing.bills_included && (
              <span style={{
                marginLeft: "8px", fontSize: "13px",
                color: "#16A34A", fontWeight: "600"
              }}>
                all bills included
              </span>
            )}
            {listing.deposit && (
              <span style={{
                marginLeft: "auto", fontSize: "14px",
                color: "#717171"
              }}>
                Deposit: <strong style={{ color: "#222" }}>€{listing.deposit}</strong>
              </span>
            )}
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "20px",
          alignItems: "start"
        }}>

          {/* Left column */}
          <div>
            {/* Details */}
            <div style={{
              background: "white", borderRadius: "20px",
              border: "1px solid #EBEBEB",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              padding: "28px", marginBottom: "20px"
            }}>
              <Section title="Room Details">
                <InfoRow label="Room Type" value={listing.room_type?.charAt(0).toUpperCase() + listing.room_type?.slice(1)} />
                <InfoRow label="Available From" value={formatDate(listing.available_from)} />
                <InfoRow label="Duration" value={listing.is_permanent ? "Permanent" : `${listing.duration_months} months`} />
                <InfoRow label="Gender Preference" value={listing.gender_preference?.charAt(0).toUpperCase() + listing.gender_preference?.slice(1)} />
                <InfoRow label="Suitable For" value={listing.occupant_type?.join(", ")} />
                <InfoRow label="Area" value={listing.dublin_area} />
              </Section>

              {listing.amenities?.length > 0 && (
                <Section title="Amenities">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {listing.amenities.map(a => (
                      <Badge key={a}>{a}</Badge>
                    ))}
                  </div>
                </Section>
              )}

              {listing.transport_links?.length > 0 && (
                <Section title="Transport Links">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {listing.transport_links.map(t => (
                      <Badge key={t} bg="#EFF6FF" color="#1D4ED8">
                        <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8 2 4 5 4 10c0 7 8 12 8 12s8-5 8-12c0-5-4-8-8-8z" />
                        </svg>
                        {t}
                      </Badge>
                    ))}
                  </div>
                </Section>
              )}

              {listing.nearby_places?.length > 0 && (
                <Section title="Nearby Places">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {listing.nearby_places.map(p => (
                      <Badge key={p} bg="#F5F3FF" color="#6D28D9">{p}</Badge>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          </div>

          {/* Right column */}
          <div style={{ position: "sticky", top: "100px" }}>
            <div style={{
              background: "white", borderRadius: "20px",
              border: "1px solid #EBEBEB",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              padding: "24px"
            }}>
              <h3 style={{
                margin: "0 0 6px", fontSize: "18px",
                fontWeight: "700", color: "#222"
              }}>
                Interested?
              </h3>
              <p style={{
                margin: "0 0 20px", fontSize: "14px", color: "#717171"
              }}>
                Contact the landlord directly via WhatsApp or call.
              </p>

              {!contactRevealed ? (
                <button
                  onClick={() => setContactRevealed(true)}
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #FF385C, #E31C5F)",
                    color: "white", border: "none",
                    borderRadius: "12px", padding: "16px",
                    fontSize: "16px", fontWeight: "700",
                    cursor: "pointer", fontFamily: "inherit",
                    boxShadow: "0 4px 16px rgba(255,56,92,0.3)",
                    transition: "opacity 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  Show Contact
                </button>
              ) : (
                <div>
                  <div style={{
                    background: "#F7F7F7", borderRadius: "12px",
                    padding: "16px", textAlign: "center",
                    marginBottom: "12px"
                  }}>
                    <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#717171", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Contact Number
                    </p>
                    <p style={{
                      margin: 0, fontSize: "22px",
                      fontWeight: "800", color: "#222",
                      letterSpacing: "1px"
                    }}>
                      {listing.contact}
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/${listing.contact?.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block", width: "100%",
                      background: "#25D366", color: "white",
                      textDecoration: "none", borderRadius: "12px",
                      padding: "14px", fontSize: "15px",
                      fontWeight: "700", textAlign: "center",
                      boxShadow: "0 4px 12px rgba(37,211,102,0.3)",
                      boxSizing: "border-box"
                    }}
                  >
                    Message on WhatsApp
                  </a>
                </div>
              )}

              <div style={{
                marginTop: "20px", paddingTop: "20px",
                borderTop: "1px solid #F0F0F0"
              }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: "13px", color: "#717171", marginBottom: "6px"
                }}>
                  <span>Monthly Rent</span>
                  <strong style={{ color: "#222" }}>€{listing.price}</strong>
                </div>
                {listing.deposit && (
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    fontSize: "13px", color: "#717171", marginBottom: "6px"
                  }}>
                    <span>Deposit</span>
                    <strong style={{ color: "#222" }}>€{listing.deposit}</strong>
                  </div>
                )}
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: "13px", color: "#717171"
                }}>
                  <span>Bills</span>
                  <strong style={{ color: listing.bills_included ? "#16A34A" : "#222" }}>
                    {listing.bills_included ? "Included" : "Not included"}
                  </strong>
                </div>
              </div>
            </div>

            {/* Report link */}
            <p style={{
              textAlign: "center", fontSize: "12px",
              color: "#AAAAAA", marginTop: "12px"
            }}>
              Something wrong with this listing?{" "}
              <a href="mailto:support@bookmyroom.ie" style={{ color: "#717171" }}>
                Report it
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}