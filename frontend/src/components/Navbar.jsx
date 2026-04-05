import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "white", borderBottom: "1px solid #EBEBEB",
      padding: "0 16px", height: "68px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 1px 12px rgba(0,0,0,0.08)"
    }}>
      {/* Logo */}
      <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z" fill="#FF385C"/>
          <path d="M16 7c-1.5 0-2.8.6-3.8 1.5L8 13v10h4v-6h8v6h4V13l-4.2-4.5C18.8 7.6 17.5 7 16 7z" fill="white"/>
        </svg>
        <span style={{ fontSize: "18px", fontWeight: "700", color: "#FF385C", fontFamily: "Georgia, serif" }}>
          BookMyRoom
        </span>
      </a>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <a href="/browse" style={{
          textDecoration: "none", color: "#222",
          fontSize: "14px", fontWeight: "600",
          padding: "8px 12px", borderRadius: "24px",
        }}>
          Browse
        </a>

        {user ? (
          /* Logged in state */
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "white", border: "1.5px solid #EBEBEB",
                borderRadius: "24px", padding: "6px 12px 6px 6px",
                cursor: "pointer", fontFamily: "inherit"
              }}
            >
              {/* Avatar */}
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: "linear-gradient(135deg, #FF385C, #E31C5F)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: "700", color: "white"
              }}>
                {user.email?.[0].toUpperCase()}
              </div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#222" }}>
                Account
              </span>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#717171" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <>
                <div
                  onClick={() => setMenuOpen(false)}
                  style={{ position: "fixed", inset: 0, zIndex: 10 }}
                />
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "white", borderRadius: "14px",
                  border: "1px solid #EBEBEB",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  minWidth: "180px", zIndex: 20, overflow: "hidden"
                }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #F0F0F0" }}>
                    <p style={{ margin: 0, fontSize: "12px", color: "#717171" }}>Signed in as</p>
                    <p style={{
                      margin: 0, fontSize: "13px", fontWeight: "600",
                      color: "#222", overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap"
                    }}>
                      {user.email}
                    </p>
                  </div>
                  {[
                    { label: "My Listings", href: "/my-listings" },
                    { label: "Post a Room", href: "/submit" },
                  ].map(item => (
                    <a key={item.label} href={item.href} style={{
                      display: "block", padding: "12px 16px",
                      fontSize: "14px", color: "#222", textDecoration: "none",
                      fontWeight: "500"
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "#F7F7F7"}
                      onMouseLeave={e => e.currentTarget.style.background = "white"}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                  <div style={{ borderTop: "1px solid #F0F0F0" }}>
                    <button onClick={handleLogout} style={{
                      display: "block", width: "100%", padding: "12px 16px",
                      fontSize: "14px", color: "#E31C5F", textAlign: "left",
                      background: "none", border: "none", cursor: "pointer",
                      fontFamily: "inherit", fontWeight: "500"
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "#FFF1F2"}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}
                    >
                      Log out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Logged out state */
          <>
            <a href="/login" style={{
              textDecoration: "none", color: "#222",
              fontSize: "14px", fontWeight: "600",
              padding: "8px 12px", borderRadius: "24px",
            }}>
              Log in
            </a>
            <a href="/submit" style={{
              textDecoration: "none",
              background: "linear-gradient(135deg, #FF385C, #E31C5F)",
              color: "white", fontSize: "13px", fontWeight: "600",
              padding: "10px 16px", borderRadius: "24px",
              boxShadow: "0 4px 12px rgba(255,56,92,0.3)",
              whiteSpace: "nowrap"
            }}>
              + Post a Room
            </a>
          </>
        )}
      </div>
    </nav>
  );
}