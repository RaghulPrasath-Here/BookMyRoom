import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_BASE } from "../constants";
import { Helmet } from 'react-helmet-async';

function Badge({ children, bg = "#F7F7F7", color = "#484848" }) {
  return (
    <span style={{
      background: bg, color, fontSize: "13px", fontWeight: "600",
      padding: "6px 12px", borderRadius: "20px",
      display: "inline-flex", alignItems: "center", gap: "5px",
      border: "1px solid rgba(0,0,0,0.06)"
    }}>
      {children}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <h3 style={{
        margin: "0 0 12px", fontSize: "15px", fontWeight: "700", color: "#222",
        paddingBottom: "10px", borderBottom: "1px solid #F0F0F0"
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
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "11px 0", borderBottom: "1px solid #F7F7F7"
    }}>
      <span style={{ fontSize: "14px", color: "#717171", fontWeight: "500" }}>{label}</span>
      <span style={{ fontSize: "14px", color: "#222", fontWeight: "600", textAlign: "right", maxWidth: "55%" }}>{value}</span>
    </div>
  );
}

function SkeletonDetail() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px 16px" }}>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }`}</style>
      {[240, 160, 120, 200].map((h, i) => (
        <div key={i} style={{
          height: `${h}px`, borderRadius: "16px", marginBottom: "16px",
          background: "linear-gradient(90deg,#F0F0F0 25%,#E8E8E8 50%,#F0F0F0 75%)",
          backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite"
        }} />
      ))}
    </div>
  );
}

function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Check out this room on BookMyRoom", url });
        return;
      } catch { }
    }
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleShare} style={{
      display: "flex", alignItems: "center", gap: "6px",
      background: copied ? "#F0FDF4" : "white",
      border: copied ? "1.5px solid #BBF7D0" : "1.5px solid #EBEBEB",
      borderRadius: "24px", padding: "8px 16px",
      fontSize: "13px", fontWeight: "600",
      color: copied ? "#16A34A" : "#484848",
      cursor: "pointer", fontFamily: "inherit",
      transition: "all 0.2s", flexShrink: 0
    }}>
      {copied ? (
        <>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share listing
        </>
      )}
    </button>
  );
}

function SimilarListings({ currentId, area, roomType }) {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${API_BASE}/search/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: `${roomType} room in ${area}` })
        });
        const data = await res.json();
        const filtered = (data.results || [])
          .filter(l => l.id !== currentId)
          .slice(0, 3);
        setSimilar(filtered);
      } catch {
        setSimilar([]);
      } finally {
        setLoading(false);
      }
    };
    if (area) fetch_();
  }, [currentId, area, roomType]);

  if (loading) return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
      {Array(3).fill(0).map((_, i) => (
        <div key={i} style={{
          height: "160px", borderRadius: "12px",
          background: "linear-gradient(90deg,#F0F0F0 25%,#E8E8E8 50%,#F0F0F0 75%)",
          backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite"
        }} />
      ))}
    </div>
  );

  if (similar.length === 0) return null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
      {similar.map(item => (
        <a key={item.id} href={`/listings/${item.id}`} style={{ textDecoration: "none" }}>
          <div
            style={{
              background: "white", borderRadius: "14px",
              border: "1px solid #EBEBEB", overflow: "hidden",
              transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{
              height: "80px",
              position: "relative",
              overflow: "hidden",
              borderRadius: "14px 14px 0 0"
            }}>
              <img
                src="/banner.png"
                alt="Room"
                style={{
                  width: "100%", height: "100%",
                  objectFit: "cover",
                  objectPosition: "center center"
                }}
              />
            </div>
            <div style={{ padding: "12px" }}>
              <p style={{
                margin: "0 0 4px", fontSize: "13px", fontWeight: "600", color: "#222",
                overflow: "hidden", display: "-webkit-box",
                WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: "1.3"
              }}>
                {item.title}
              </p>
              <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#717171" }}>
                📍 {item.dublin_area}
              </p>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#FF385C" }}>
                €{item.price}
                <span style={{ fontSize: "11px", fontWeight: "400", color: "#717171" }}>/mo</span>
              </p>
            </div>
          </div>
        </a>
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/listings/${id}`);
        if (!res.ok) throw new Error("Not found");
        setListing(await res.json());
      } catch { setError("This listing could not be found."); }
      finally { setLoading(false); }
    };
    fetchListing();
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [id]);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IE", {
    day: "numeric", month: "long", year: "numeric"
  }) : null;

  const daysAgo = (d) => {
    if (!d) return "";
    const diff = Math.floor((new Date() - new Date(d)) / 86400000);
    if (diff === 0) return "Posted today";
    if (diff === 1) return "Posted yesterday";
    return `Posted ${diff} days ago`;
  };

  const gradientMap = {
    ensuite: "#667eea, #764ba2", studio: "#f093fb, #f5576c",
    double: "#4facfe, #00f2fe", single: "#43e97b, #38f9d7", shared: "#fa709a, #fee140",
  };

  if (loading) return <SkeletonDetail />;

  if (error) return (
    <div style={{
      minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center",
      justifyContent: "center", flexDirection: "column", gap: "12px",
      padding: "24px", textAlign: "center",
      fontFamily: "-apple-system, sans-serif"
    }}>
      <div style={{ fontSize: "48px" }}>🏚️</div>
      <h2 style={{ margin: 0, color: "#222" }}>Listing not found</h2>
      <p style={{ color: "#717171", margin: 0, fontSize: "14px" }}>
        This listing may have expired or been removed.
      </p>
      <a href="/" style={{
        background: "#FF385C", color: "white", textDecoration: "none",
        padding: "12px 24px", borderRadius: "24px", fontSize: "14px", fontWeight: "600"
      }}>Browse all listings</a>
    </div>
  );

  const gradient = gradientMap[listing.room_type] || "#4facfe, #00f2fe";
  const emoji = { ensuite: "🛁", studio: "🏢", double: "🛏️", single: "🛏️", shared: "🏠" }[listing.room_type] || "🏠";

  const ContactCard = () => (
    <div style={{
      background: "white", borderRadius: "20px", border: "1px solid #EBEBEB",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: "20px"
    }}>
      <h3 style={{ margin: "0 0 6px", fontSize: "17px", fontWeight: "700", color: "#222" }}>
        Interested?
      </h3>
      <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#717171" }}>
        Contact the landlord directly via WhatsApp or call.
      </p>

      {!contactRevealed ? (
        <button onClick={() => setContactRevealed(true)} style={{
          width: "100%",
          background: "linear-gradient(135deg, #FF385C, #E31C5F)",
          color: "white", border: "none", borderRadius: "12px", padding: "14px",
          fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 4px 16px rgba(255,56,92,0.3)"
        }}>
          Show Contact
        </button>
      ) : (
        <div>
          <div style={{
            background: "#F7F7F7", borderRadius: "12px",
            padding: "14px", textAlign: "center", marginBottom: "10px"
          }}>
            <p style={{ margin: "0 0 3px", fontSize: "11px", color: "#717171", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Contact Number
            </p>
            <p style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#222", letterSpacing: "1px" }}>
              {listing.contact}
            </p>
          </div>
          <a
            href={`https://wa.me/${listing.contact?.replace(/[^0-9]/g, "")}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: "block", width: "100%", background: "#25D366",
              color: "white", textDecoration: "none", borderRadius: "12px",
              padding: "13px", fontSize: "14px", fontWeight: "700",
              textAlign: "center", boxSizing: "border-box",
              boxShadow: "0 4px 12px rgba(37,211,102,0.3)"
            }}
          >
            Message on WhatsApp
          </a>
        </div>
      )}

      <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #F0F0F0" }}>
        {[
          { label: "Monthly Rent", value: `€${listing.price}` },
          listing.deposit ? { label: "Deposit", value: `€${listing.deposit}` } : null,
          { label: "Bills", value: listing.bills_included ? "Included" : "Not included", green: listing.bills_included }
        ].filter(Boolean).map(row => (
          <div key={row.label} style={{
            display: "flex", justifyContent: "space-between",
            fontSize: "13px", color: "#717171", marginBottom: "6px"
          }}>
            <span>{row.label}</span>
            <strong style={{ color: row.green ? "#16A34A" : "#222" }}>{row.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "calc(100vh - 68px)", background: "#F7F7F7",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <Helmet>
        <title>{listing.title} — BookMyRoom</title>
        <meta name="description" content={`${listing.room_type} in ${listing.dublin_area}. €${listing.price}/month.`} />
      </Helmet>

      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }`}</style>

      {/* Hero banner */}
<div style={{
  height: "clamp(200px, 35vw, 320px)",
  position: "relative", overflow: "hidden"
}}>
  <img
    src="/banner.png"
    alt="Room"
    style={{
      width: "100%", height: "100%",
      objectFit: "cover", objectPosition: "center center"
    }}
  />
  <div style={{
    position: "absolute", inset: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 50%)"
  }} />
  {/* Back button */}
  <a href="/" style={{
    position: "absolute", top: "16px", left: "16px",
    textDecoration: "none", background: "rgba(255,255,255,0.95)",
    color: "#222", borderRadius: "24px", padding: "7px 14px",
    fontSize: "13px", fontWeight: "600",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)"
  }}>← Back</a>
  {/* Days ago */}
  <div style={{
    position: "absolute", top: "16px", right: "16px",
    background: "rgba(255,255,255,0.95)", borderRadius: "20px",
    padding: "5px 12px", fontSize: "11px", fontWeight: "600", color: "#717171"
  }}>
    {daysAgo(listing.created_at)}
  </div>
</div>

      {/* Content */}
      <div style={{
        maxWidth: "800px", margin: "0 auto",
        padding: "0 16px 60px", animation: "fadeUp 0.5s ease both"
      }}>

        {/* Title card */}
        <div style={{
          background: "white", borderRadius: "20px", border: "1px solid #EBEBEB",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)", padding: "20px",
          marginTop: "-32px", position: "relative", zIndex: 10, marginBottom: "16px"
        }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
            {listing.is_permanent
              ? <Badge bg="#ECFDF5" color="#065F46">Permanent</Badge>
              : <Badge bg="#FFF7ED" color="#92400E">{listing.duration_months} months</Badge>}
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
            {listing.bills_included && <Badge bg="#F0FDF4" color="#16A34A">Bills included</Badge>}
          </div>

          {/* Title row with share button */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "8px" }}>
            <h1 style={{
              margin: 0, fontSize: "clamp(20px, 5vw, 26px)",
              fontWeight: "800", color: "#222",
              fontFamily: "Georgia, serif", lineHeight: "1.3"
            }}>
              {listing.title || "Room in Dublin"}
            </h1>
            <ShareButton />
          </div>

          <p style={{ margin: "0 0 16px", fontSize: "14px", color: "#717171", display: "flex", alignItems: "center", gap: "5px" }}>
            <svg width="13" height="13" fill="#FF385C" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            {listing.location || listing.dublin_area || "Dublin"}
          </p>

          <div style={{ display: "flex", alignItems: "baseline", gap: "6px", paddingTop: "14px", borderTop: "1px solid #F0F0F0", flexWrap: "wrap" }}>
            <span style={{ fontSize: "clamp(24px, 6vw, 32px)", fontWeight: "800", color: "#222" }}>€{listing.price}</span>
            <span style={{ fontSize: "15px", color: "#717171" }}>/month</span>
            {listing.bills_included && (
              <span style={{ fontSize: "12px", color: "#16A34A", fontWeight: "600" }}>all bills included</span>
            )}
            {listing.deposit && (
              <span style={{ marginLeft: "auto", fontSize: "13px", color: "#717171" }}>
                Deposit: <strong style={{ color: "#222" }}>€{listing.deposit}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Mobile: contact first */}
        {isMobile && <div style={{ marginBottom: "16px" }}><ContactCard /></div>}

        {/* Details + Desktop contact */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 300px",
          gap: "16px", alignItems: "start"
        }}>
          <div style={{
            background: "white", borderRadius: "20px", border: "1px solid #EBEBEB",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)", padding: "20px"
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
                  {listing.amenities.map(a => <Badge key={a}>{a}</Badge>)}
                </div>
              </Section>
            )}

            {listing.transport_links?.length > 0 && (
              <Section title="Transport Links">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {listing.transport_links.map(t => <Badge key={t} bg="#EFF6FF" color="#1D4ED8">{t}</Badge>)}
                </div>
              </Section>
            )}

            {listing.nearby_places?.length > 0 && (
              <Section title="Nearby Places">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {listing.nearby_places.map(p => <Badge key={p} bg="#F5F3FF" color="#6D28D9">{p}</Badge>)}
                </div>
              </Section>
            )}
          </div>

          {/* Desktop contact */}
          {!isMobile && (
            <div style={{ position: "sticky", top: "88px" }}>
              <ContactCard />
              <p style={{ textAlign: "center", fontSize: "12px", color: "#AAAAAA", marginTop: "10px" }}>
                Something wrong?{" "}
                <a href="mailto:support@bookmyroom.ie" style={{ color: "#717171" }}>Report it</a>
              </p>
            </div>
          )}
        </div>
        {/* Photos */}
        {listing.photos?.length > 0 && (
          <div style={{
            marginTop: "16px", background: "white",
            borderRadius: "20px", border: "1px solid #EBEBEB",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)", padding: "20px"
          }}>
            <h3 style={{
              margin: "0 0 16px", fontSize: "15px", fontWeight: "700", color: "#222",
              paddingBottom: "10px", borderBottom: "1px solid #F0F0F0"
            }}>
              Photos
            </h3>
            <div style={{
                display: "grid",
                gridTemplateColumns: listing.photos.length === 1
                  ? "1fr"
                  : listing.photos.length === 2
                  ? "1fr 1fr"
                  : listing.photos.length === 3
                  ? "1fr 1fr 1fr"
                  : "repeat(2, 1fr)",
                gap: "8px"
              }}>
                {listing.photos.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={url}
                      alt={`Room photo ${i + 1}`}
                      style={{
                        width: "100%",
                        aspectRatio: listing.photos.length === 1 ? "16/9" : "4/3",
                        objectFit: "cover", borderRadius: "10px",
                        border: "1px solid #EBEBEB",
                        transition: "opacity 0.2s",
                        cursor: "pointer", display: "block"
                      }}
                      onMouseEnter={e => e.target.style.opacity = "0.85"}
                      onMouseLeave={e => e.target.style.opacity = "1"}
                    />
                  </a>
                ))}
              </div>
            <p style={{ margin: "10px 0 0", fontSize: "12px", color: "#AAAAAA" }}>
              Click any photo to view full size
            </p>
          </div>
        )}

        {/* Similar listings */}
        {listing.dublin_area && (
          <div style={{
            marginTop: "28px", background: "white", borderRadius: "20px",
            border: "1px solid #EBEBEB",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)", padding: "20px"
          }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "700", color: "#222" }}>
              More rooms in {listing.dublin_area}
            </h3>
            <SimilarListings
              currentId={listing.id}
              area={listing.dublin_area}
              roomType={listing.room_type}
            />
          </div>
        )}

        {/* Mobile report link */}
        {isMobile && (
          <p style={{ textAlign: "center", fontSize: "12px", color: "#AAAAAA", marginTop: "16px" }}>
            Something wrong?{" "}
            <a href="mailto:support@bookmyroom.ie" style={{ color: "#717171" }}>Report it</a>
          </p>
        )}
      </div>
    </div>
  );
}