import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 68px)", background: "#F7F7F7",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 16px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <Helmet><title>Login — BookMyRoom</title></Helmet>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        input:focus { outline: none; border-color: #FF385C !important; box-shadow: 0 0 0 3px rgba(255,56,92,0.1) !important; }
      `}</style>

      <div style={{ width: "100%", maxWidth: "420px", animation: "fadeUp 0.5s ease both" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none" style={{ margin: "0 auto 12px", display: "block" }}>
              <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z" fill="#FF385C"/>
              <path d="M16 7c-1.5 0-2.8.6-3.8 1.5L8 13v10h4v-6h8v6h4V13l-4.2-4.5C18.8 7.6 17.5 7 16 7z" fill="white"/>
            </svg>
          </a>
          <h1 style={{
            margin: "0 0 8px", fontSize: "26px", fontWeight: "800",
            color: "#222", fontFamily: "Georgia, serif"
          }}>
            Welcome back
          </h1>
          <p style={{ margin: 0, fontSize: "15px", color: "#717171" }}>
            Log in to manage your listings
          </p>
        </div>

        {/* Form card */}
        <div style={{
          background: "white", borderRadius: "20px",
          border: "1px solid #EBEBEB",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          padding: "28px"
        }}>
          <form onSubmit={handleLogin}>

            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block", fontSize: "12px", fontWeight: "700",
                color: "#222", marginBottom: "6px",
                textTransform: "uppercase", letterSpacing: "0.5px"
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                style={{
                  width: "100%", padding: "12px 14px",
                  border: "1.5px solid #EBEBEB", borderRadius: "10px",
                  fontSize: "15px", color: "#222", fontFamily: "inherit",
                  boxSizing: "border-box", transition: "border-color 0.2s"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block", fontSize: "12px", fontWeight: "700",
                color: "#222", marginBottom: "6px",
                textTransform: "uppercase", letterSpacing: "0.5px"
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "12px 14px",
                  border: "1.5px solid #EBEBEB", borderRadius: "10px",
                  fontSize: "15px", color: "#222", fontFamily: "inherit",
                  boxSizing: "border-box", transition: "border-color 0.2s"
                }}
              />
            </div>

            {error && (
              <div style={{
                background: "#FFF1F2", border: "1px solid #FFD6DC",
                borderRadius: "10px", padding: "12px 14px",
                color: "#E31C5F", fontSize: "14px", marginBottom: "16px"
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "#CCC" : "linear-gradient(135deg, #FF385C, #E31C5F)",
                color: "white", border: "none", borderRadius: "12px",
                padding: "14px", fontSize: "16px", fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                boxShadow: loading ? "none" : "0 4px 16px rgba(255,56,92,0.3)"
              }}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#717171" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#FF385C", fontWeight: "600", textDecoration: "none" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}