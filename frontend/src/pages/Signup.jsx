import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await signUp(email, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
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
      <Helmet><title>Sign Up — BookMyRoom</title></Helmet>
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
            Create an account
          </h1>
          <p style={{ margin: 0, fontSize: "15px", color: "#717171" }}>
            Post and manage your Dublin listings
          </p>
        </div>

        {success ? (
          /* Success state */
          <div style={{
            background: "white", borderRadius: "20px",
            border: "1px solid #EBEBEB",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            padding: "32px", textAlign: "center"
          }}>
            <div style={{
              width: "64px", height: "64px",
              background: "linear-gradient(135deg, #16A34A, #22C55E)",
              borderRadius: "50%", margin: "0 auto 16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(22,163,74,0.3)"
            }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: "700", color: "#222" }}>
              Check your email
            </h2>
            <p style={{ margin: "0 0 20px", fontSize: "14px", color: "#717171", lineHeight: "1.6" }}>
              We sent a verification link to <strong>{email}</strong>.
              Click it to activate your account, then log in.
            </p>
            <Link to="/login" style={{
              display: "block", background: "linear-gradient(135deg, #FF385C, #E31C5F)",
              color: "white", textDecoration: "none", borderRadius: "12px",
              padding: "14px", fontSize: "15px", fontWeight: "700",
              boxShadow: "0 4px 16px rgba(255,56,92,0.3)"
            }}>
              Go to Login
            </Link>
          </div>
        ) : (
          /* Form */
          <div style={{
            background: "white", borderRadius: "20px",
            border: "1px solid #EBEBEB",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            padding: "28px"
          }}>
            <form onSubmit={handleSignup}>

              {[
                { label: "Email", value: email, setter: setEmail, type: "email", placeholder: "you@email.com" },
                { label: "Password", value: password, setter: setPassword, type: "password", placeholder: "Min. 6 characters" },
                { label: "Confirm Password", value: confirm, setter: setConfirm, type: "password", placeholder: "Repeat your password" }
              ].map(field => (
                <div key={field.label} style={{ marginBottom: "16px" }}>
                  <label style={{
                    display: "block", fontSize: "12px", fontWeight: "700",
                    color: "#222", marginBottom: "6px",
                    textTransform: "uppercase", letterSpacing: "0.5px"
                  }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={e => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    style={{
                      width: "100%", padding: "12px 14px",
                      border: "1.5px solid #EBEBEB", borderRadius: "10px",
                      fontSize: "15px", color: "#222", fontFamily: "inherit",
                      boxSizing: "border-box", transition: "border-color 0.2s"
                    }}
                  />
                </div>
              ))}

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
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>
        )}

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#717171" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#FF385C", fontWeight: "600", textDecoration: "none" }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}