import { useState, useEffect } from "react";
import ListingCard from "../components/ListingCard";
import SkeletonCard from "../components/SkeletonCard";
import { API_BASE } from "../constants";

const DUBLIN_AREAS = [
  "All Areas", "Dublin 1", "Dublin 2", "Dublin 4", "Dublin 6",
  "Dublin 7", "Dublin 8", "Dublin 9", "Dublin 12", "Dublin 15",
  "Rathmines", "Ranelagh", "Citywest", "Tallaght", "Swords",
  "Dún Laoghaire", "Sandyford", "Clondalkin"
];

const ROOM_TYPES = ["single", "double", "ensuite", "studio", "shared"];
const GENDER_OPTIONS = ["male", "female", "couple", "any"];

function FilterSection({ title, children }) {
  return (
    <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #F0F0F0" }}>
      <p style={{
        margin: "0 0 10px", fontSize: "11px", fontWeight: "700",
        color: "#222", textTransform: "uppercase", letterSpacing: "0.5px"
      }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function CheckChip({ label, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 12px", borderRadius: "20px",
      fontSize: "13px", fontWeight: "600",
      border: selected ? "2px solid #FF385C" : "1.5px solid #EBEBEB",
      background: selected ? "#FFF1F2" : "white",
      color: selected ? "#FF385C" : "#717171",
      cursor: "pointer", fontFamily: "inherit",
      marginRight: "6px", marginBottom: "6px"
    }}>
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </button>
  );
}

export default function Browse() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [area, setArea] = useState("All Areas");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [roomTypes, setRoomTypes] = useState([]);
  const [genderPref, setGenderPref] = useState([]);
  const [isPermanent, setIsPermanent] = useState(null);
  const [billsIncluded, setBillsIncluded] = useState(null);

  useEffect(() => {
    fetchListings();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true); setError(null);
      const res = await fetch(`${API_BASE}/listings/?limit=50`);
      const data = await res.json();
      setListings(data.listings || []);
    } catch { setError("Failed to load listings."); }
    finally { setLoading(false); }
  };

  const toggleArray = (arr, setArr, val) => {
    if (arr.includes(val)) setArr(arr.filter(v => v !== val));
    else setArr([...arr, val]);
  };

  const resetFilters = () => {
    setArea("All Areas"); setMaxPrice(2000);
    setRoomTypes([]); setGenderPref([]);
    setIsPermanent(null); setBillsIncluded(null);
  };

  const filtered = listings.filter(l => {
    if (area !== "All Areas" && l.dublin_area !== area) return false;
    if (l.price && l.price > maxPrice) return false;
    if (roomTypes.length > 0 && !roomTypes.includes(l.room_type)) return false;
    if (genderPref.length > 0 && !genderPref.includes(l.gender_preference)) return false;
    if (isPermanent !== null && l.is_permanent !== isPermanent) return false;
    if (billsIncluded !== null && l.bills_included !== billsIncluded) return false;
    return true;
  });

  const hasActiveFilters = area !== "All Areas" || maxPrice < 2000 ||
    roomTypes.length > 0 || genderPref.length > 0 ||
    isPermanent !== null || billsIncluded !== null;

  const activeFilterCount = [
    area !== "All Areas", maxPrice < 2000,
    roomTypes.length > 0, genderPref.length > 0,
    isPermanent !== null, billsIncluded !== null
  ].filter(Boolean).length;

  const FilterPanel = () => (
    <div style={{
      background: "white", borderRadius: "16px",
      border: "1px solid #EBEBEB",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      padding: "20px"
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "18px"
      }}>
        <h2 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#222" }}>
          Filters
        </h2>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {hasActiveFilters && (
            <button onClick={resetFilters} style={{
              background: "none", border: "none", fontSize: "13px",
              fontWeight: "600", color: "#FF385C", cursor: "pointer",
              fontFamily: "inherit", textDecoration: "underline"
            }}>
              Reset all
            </button>
          )}
          {isMobile && (
            <button onClick={() => setFiltersOpen(false)} style={{
              background: "none", border: "none", fontSize: "20px",
              cursor: "pointer", color: "#717171", padding: "0 4px"
            }}>×</button>
          )}
        </div>
      </div>

      <FilterSection title="Area">
        <select value={area} onChange={e => setArea(e.target.value)} style={{
          width: "100%", padding: "10px 12px",
          border: "1.5px solid #EBEBEB", borderRadius: "10px",
          fontSize: "14px", color: "#222", background: "white",
          fontFamily: "inherit", cursor: "pointer", outline: "none"
        }}>
          {DUBLIN_AREAS.map(a => <option key={a}>{a}</option>)}
        </select>
      </FilterSection>

      <FilterSection title={`Max Price — €${maxPrice}/mo`}>
        <input type="range" min={300} max={2000} step={50}
          value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#FF385C" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#AAAAAA", marginTop: "4px" }}>
          <span>€300</span><span>€2000</span>
        </div>
      </FilterSection>

      <FilterSection title="Room Type">
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {ROOM_TYPES.map(t => (
            <CheckChip key={t} label={t} selected={roomTypes.includes(t)}
              onClick={() => toggleArray(roomTypes, setRoomTypes, t)} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Gender Preference">
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {GENDER_OPTIONS.map(g => (
            <CheckChip key={g} label={g} selected={genderPref.includes(g)}
              onClick={() => toggleArray(genderPref, setGenderPref, g)} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Listing Type">
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[{ label: "All", val: null }, { label: "Permanent", val: true }, { label: "Temporary", val: false }].map(opt => (
            <button key={opt.label} onClick={() => setIsPermanent(opt.val)} style={{
              padding: "7px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "600",
              border: isPermanent === opt.val ? "2px solid #FF385C" : "1.5px solid #EBEBEB",
              background: isPermanent === opt.val ? "#FFF1F2" : "white",
              color: isPermanent === opt.val ? "#FF385C" : "#717171",
              cursor: "pointer", fontFamily: "inherit"
            }}>{opt.label}</button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Bills">
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[{ label: "Any", val: null }, { label: "Included", val: true }, { label: "Not included", val: false }].map(opt => (
            <button key={opt.label} onClick={() => setBillsIncluded(opt.val)} style={{
              padding: "7px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "600",
              border: billsIncluded === opt.val ? "2px solid #FF385C" : "1.5px solid #EBEBEB",
              background: billsIncluded === opt.val ? "#FFF1F2" : "white",
              color: billsIncluded === opt.val ? "#FF385C" : "#717171",
              cursor: "pointer", fontFamily: "inherit"
            }}>{opt.label}</button>
          ))}
        </div>
      </FilterSection>

      {/* Apply button on mobile */}
      {isMobile && (
        <button onClick={() => setFiltersOpen(false)} style={{
          width: "100%", background: "linear-gradient(135deg, #FF385C, #E31C5F)",
          color: "white", border: "none", borderRadius: "12px",
          padding: "14px", fontSize: "15px", fontWeight: "700",
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 4px 16px rgba(255,56,92,0.3)"
        }}>
          Show {filtered.length} results
        </button>
      )}
    </div>
  );

  return (
    <div style={{
      minHeight: "calc(100vh - 68px)", background: "#F7F7F7",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        * { box-sizing: border-box; }
        .browse-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 18px;
        }
        @media (max-width: 600px) {
          .browse-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Page header */}
      <div style={{
        background: "white", borderBottom: "1px solid #EBEBEB",
        padding: "20px 16px"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{
                margin: "0 0 3px", fontSize: "clamp(20px, 5vw, 26px)",
                fontWeight: "800", color: "#222", fontFamily: "Georgia, serif"
              }}>
                All Listings
              </h1>
              <p style={{ margin: 0, fontSize: "13px", color: "#717171" }}>
                {loading ? "Loading..." : `${filtered.length} rooms available`}
              </p>
            </div>

            {/* Filter toggle — visible on all screens, useful on mobile */}
            {isMobile && (
              <button onClick={() => setFiltersOpen(true)} style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: hasActiveFilters ? "#FFF1F2" : "white",
                border: hasActiveFilters ? "1.5px solid #FF385C" : "1.5px solid #EBEBEB",
                borderRadius: "24px", padding: "9px 16px",
                fontSize: "14px", fontWeight: "600",
                color: hasActiveFilters ? "#FF385C" : "#222",
                cursor: "pointer", fontFamily: "inherit"
              }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2" />
                </svg>
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 16px" }}>
        {/* Desktop: sidebar layout */}
        {!isMobile ? (
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "24px", alignItems: "start" }}>
            <div style={{ position: "sticky", top: "88px" }}>
              <FilterPanel />
            </div>
            <div>
              {error && (
                <div style={{
                  background: "#FFF1F2", border: "1px solid #FFD6DC",
                  borderRadius: "12px", padding: "14px 16px", color: "#E31C5F",
                  marginBottom: "20px", display: "flex",
                  justifyContent: "space-between", alignItems: "center"
                }}>
                  {error}
                  <button onClick={fetchListings} style={{
                    background: "#FF385C", color: "white", border: "none",
                    borderRadius: "8px", padding: "6px 14px", fontSize: "13px", cursor: "pointer"
                  }}>Retry</button>
                </div>
              )}
              <div className="browse-grid">
                {loading ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />) :
                  filtered.length > 0 ? filtered.map((listing, i) => (
                    <div key={listing.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.04}s both` }}>
                      <ListingCard listing={listing} />
                    </div>
                  )) : (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px" }}>
                      <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
                      <h3 style={{ margin: "0 0 8px", color: "#222" }}>No listings match your filters</h3>
                      <p style={{ color: "#717171", margin: "0 0 16px", fontSize: "14px" }}>Try adjusting your filters</p>
                      <button onClick={resetFilters} style={{
                        background: "#FF385C", color: "white", border: "none",
                        borderRadius: "24px", padding: "12px 24px",
                        fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit"
                      }}>Reset filters</button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        ) : (
          /* Mobile: full width grid */
          <div>
            {error && (
              <div style={{
                background: "#FFF1F2", border: "1px solid #FFD6DC",
                borderRadius: "12px", padding: "14px 16px", color: "#E31C5F",
                marginBottom: "16px"
              }}>{error}</div>
            )}
            <div className="browse-grid">
              {loading ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />) :
                filtered.length > 0 ? filtered.map((listing, i) => (
                  <div key={listing.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.04}s both` }}>
                    <ListingCard listing={listing} />
                  </div>
                )) : (
                  <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 16px" }}>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
                    <h3 style={{ margin: "0 0 8px", color: "#222", fontSize: "18px" }}>No listings match</h3>
                    <button onClick={resetFilters} style={{
                      background: "#FF385C", color: "white", border: "none",
                      borderRadius: "24px", padding: "12px 24px",
                      fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit"
                    }}>Reset filters</button>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      {isMobile && filtersOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setFiltersOpen(false)}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.5)", zIndex: 200
            }}
          />
          {/* Drawer */}
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            background: "white", borderRadius: "20px 20px 0 0",
            padding: "20px 16px 32px",
            zIndex: 201, maxHeight: "85vh",
            overflowY: "auto",
            animation: "slideUp 0.3s ease both",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.15)"
          }}>
            {/* Handle */}
            <div style={{
              width: "40px", height: "4px", background: "#DDDDDD",
              borderRadius: "2px", margin: "0 auto 20px"
            }} />
            <FilterPanel />
          </div>
        </>
      )}
    </div>
  );
}