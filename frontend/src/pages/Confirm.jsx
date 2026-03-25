import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "../constants";
import { Helmet } from 'react-helmet-async'

const ROOM_TYPES = ["single", "double", "ensuite", "studio", "shared"];
const GENDER_OPTIONS = ["any", "male", "female", "couple"];
const OCCUPANT_OPTIONS = ["students", "professionals"];

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{
        display: "block", fontSize: "12px",
        fontWeight: "700", color: "#717171",
        marginBottom: "6px", textTransform: "uppercase",
        letterSpacing: "0.5px"
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%", padding: "12px 14px",
        border: "1.5px solid #EBEBEB", borderRadius: "10px",
        fontSize: "15px", color: "#222", background: "white",
        fontFamily: "inherit", boxSizing: "border-box",
        transition: "border-color 0.2s",
        outline: "none"
      }}
      onFocus={e => e.target.style.borderColor = "#FF385C"}
      onBlur={e => e.target.style.borderColor = "#EBEBEB"}
    />
  );
}

function Toggle({ value, onChange, labelOn = "Yes", labelOff = "No" }) {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {[true, false].map(opt => (
        <button
          key={String(opt)}
          onClick={() => onChange(opt)}
          style={{
            padding: "10px 20px", borderRadius: "20px",
            fontSize: "14px", fontWeight: "600",
            border: value === opt ? "2px solid #FF385C" : "1.5px solid #EBEBEB",
            background: value === opt ? "#FFF1F2" : "white",
            color: value === opt ? "#FF385C" : "#717171",
            cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.15s"
          }}
        >
          {opt ? labelOn : labelOff}
        </button>
      ))}
    </div>
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <select
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      style={{
        width: "100%", padding: "12px 14px",
        border: "1.5px solid #EBEBEB", borderRadius: "10px",
        fontSize: "15px", color: "#222", background: "white",
        fontFamily: "inherit", cursor: "pointer",
        outline: "none", boxSizing: "border-box"
      }}
      onFocus={e => e.target.style.borderColor = "#FF385C"}
      onBlur={e => e.target.style.borderColor = "#EBEBEB"}
    >
      {options.map(opt => (
        <option key={opt} value={opt}>
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </option>
      ))}
    </select>
  );
}

function ChipSelect({ value = [], onChange, options }) {
  const toggle = (opt) => {
    if (value.includes(opt)) {
      onChange(value.filter(v => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  };
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => toggle(opt)}
          style={{
            padding: "8px 16px", borderRadius: "20px",
            fontSize: "14px", fontWeight: "600",
            border: value.includes(opt) ? "2px solid #FF385C" : "1.5px solid #EBEBEB",
            background: value.includes(opt) ? "#FFF1F2" : "white",
            color: value.includes(opt) ? "#FF385C" : "#717171",
            cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.15s"
          }}
        >
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </button>
      ))}
    </div>
  );
}

function TagInput({ value = [], onChange, placeholder }) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  };

  const remove = (tag) => onChange(value.filter(t => t !== tag));

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
        {value.map(tag => (
          <span key={tag} style={{
            background: "#F7F7F7", border: "1px solid #EBEBEB",
            borderRadius: "20px", padding: "4px 12px",
            fontSize: "13px", color: "#484848",
            display: "inline-flex", alignItems: "center", gap: "6px"
          }}>
            {tag}
            <button
              onClick={() => remove(tag)}
              style={{
                background: "none", border: "none",
                cursor: "pointer", color: "#AAAAAA",
                fontSize: "14px", padding: "0", lineHeight: 1
              }}
            >×</button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && add()}
          placeholder={placeholder}
          style={{
            flex: 1, padding: "10px 14px",
            border: "1.5px solid #EBEBEB", borderRadius: "10px",
            fontSize: "14px", color: "#222",
            fontFamily: "inherit", outline: "none",
            boxSizing: "border-box"
          }}
          onFocus={e => e.target.style.borderColor = "#FF385C"}
          onBlur={e => e.target.style.borderColor = "#EBEBEB"}
        />
        <button
          onClick={add}
          style={{
            padding: "10px 16px", background: "#F7F7F7",
            border: "1.5px solid #EBEBEB", borderRadius: "10px",
            fontSize: "13px", fontWeight: "600",
            color: "#484848", cursor: "pointer", fontFamily: "inherit"
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default function Confirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { parsed = {}, raw_text = "" } = location.state || {};

  const [form, setForm] = useState({
    raw_text,
    title: parsed.title || "",
    price: parsed.price || "",
    bills_included: parsed.bills_included || false,
    deposit: parsed.deposit || "",
    location: parsed.location || "",
    dublin_area: parsed.dublin_area || "",
    available_from: parsed.available_from || "",
    is_permanent: parsed.is_permanent !== false,
    duration_months: parsed.duration_months || "",
    room_type: parsed.room_type || "double",
    gender_preference: parsed.gender_preference || "any",
    occupant_type: parsed.occupant_type || [],
    amenities: parsed.amenities || [],
    transport_links: parsed.transport_links || [],
    nearby_places: parsed.nearby_places || [],
    contact: parsed.contact || ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = (field) => (value) => setForm(f => ({ ...f, [field]: value }));

  const handlePublish = async () => {
    if (!form.contact?.trim()) {
      setError("Contact number is required.");
      return;
    }
    if (!form.price) {
      setError("Price is required.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/listings/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          deposit: form.deposit ? parseFloat(form.deposit) : null,
          duration_months: form.duration_months ? parseFloat(form.duration_months) : null,
        })
      });

      if (!res.ok) throw new Error("Failed to publish");

      const data = await res.json();
      navigate("/success", { state: { id: data.id, title: form.title } });
    } catch {
      setError("Failed to publish listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If no state passed, redirect to submit
  if (!location.state) {
    return (
      <div style={{
        minHeight: "calc(100vh - 80px)", display: "flex",
        alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "16px",
        fontFamily: "-apple-system, sans-serif"
      }}>
        <p style={{ color: "#717171", fontSize: "16px" }}>No listing data found.</p>
        <a href="/submit" style={{
          background: "#FF385C", color: "white",
          textDecoration: "none", padding: "12px 24px",
          borderRadius: "24px", fontSize: "14px", fontWeight: "600"
        }}>
          Go back to Submit
        </a>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "calc(100vh - 80px)",
      background: "#F7F7F7", padding: "48px 24px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>

  <Helmet>
    <title>Review Listing — BookMyRoom</title>
  </Helmet>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{
        maxWidth: "680px", margin: "0 auto",
        animation: "fadeUp 0.5s ease both"
      }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <a href="/submit" style={{
            textDecoration: "none", color: "#717171",
            fontSize: "14px", display: "inline-flex",
            alignItems: "center", gap: "6px", marginBottom: "20px"
          }}>
            ← Back to edit
          </a>
          <h1 style={{
            margin: "0 0 8px", fontSize: "32px",
            fontWeight: "800", color: "#222222",
            fontFamily: "Georgia, serif"
          }}>
            Review your listing
          </h1>
          <p style={{ margin: 0, fontSize: "16px", color: "#717171", lineHeight: "1.6" }}>
            Our AI filled in the details below. Check everything looks right before publishing.
          </p>
        </div>

        {/* AI notice */}
        <div style={{
          background: "#F0FDF4", border: "1px solid #BBF7D0",
          borderRadius: "12px", padding: "14px 18px",
          marginBottom: "24px", fontSize: "14px",
          color: "#166534", display: "flex",
          alignItems: "center", gap: "10px"
        }}>
          <span style={{ fontSize: "18px" }}>✓</span>
          AI successfully extracted your listing details. Edit anything that looks wrong.
        </div>

        {/* Form card */}
        <div style={{
          background: "white", borderRadius: "20px",
          border: "1px solid #EBEBEB",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          padding: "28px"
        }}>

          {/* Section: Basic info */}
          <p style={{
            margin: "0 0 20px", fontSize: "13px",
            fontWeight: "700", color: "#FF385C",
            textTransform: "uppercase", letterSpacing: "0.5px"
          }}>
            Basic Info
          </p>

          <Field label="Title">
            <TextInput value={form.title} onChange={update("title")} placeholder="e.g. Double Room in Dublin 12" />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="Monthly Rent (€)">
              <TextInput value={form.price} onChange={update("price")} type="number" placeholder="650" />
            </Field>
            <Field label="Deposit (€)">
              <TextInput value={form.deposit} onChange={update("deposit")} type="number" placeholder="500" />
            </Field>
          </div>

          <Field label="Bills Included">
            <Toggle value={form.bills_included} onChange={update("bills_included")} labelOn="Included" labelOff="Not Included" />
          </Field>

          <div style={{ borderTop: "1px solid #F7F7F7", margin: "24px 0" }} />

          {/* Section: Location */}
          <p style={{
            margin: "0 0 20px", fontSize: "13px",
            fontWeight: "700", color: "#FF385C",
            textTransform: "uppercase", letterSpacing: "0.5px"
          }}>
            Location
          </p>

          <Field label="Full Location">
            <TextInput value={form.location} onChange={update("location")} placeholder="e.g. Bluebell, Dublin 12" />
          </Field>

          <Field label="Dublin Area">
            <TextInput value={form.dublin_area} onChange={update("dublin_area")} placeholder="e.g. Dublin 12" />
          </Field>

          <div style={{ borderTop: "1px solid #F7F7F7", margin: "24px 0" }} />

          {/* Section: Availability */}
          <p style={{
            margin: "0 0 20px", fontSize: "13px",
            fontWeight: "700", color: "#FF385C",
            textTransform: "uppercase", letterSpacing: "0.5px"
          }}>
            Availability
          </p>

          <Field label="Available From">
            <TextInput value={form.available_from} onChange={update("available_from")} type="date" />
          </Field>

          <Field label="Listing Type">
            <Toggle value={form.is_permanent} onChange={update("is_permanent")} labelOn="Permanent" labelOff="Temporary" />
          </Field>

          {!form.is_permanent && (
            <Field label="Duration (months)">
              <TextInput value={form.duration_months} onChange={update("duration_months")} type="number" placeholder="e.g. 3" />
            </Field>
          )}

          <div style={{ borderTop: "1px solid #F7F7F7", margin: "24px 0" }} />

          {/* Section: Room details */}
          <p style={{
            margin: "0 0 20px", fontSize: "13px",
            fontWeight: "700", color: "#FF385C",
            textTransform: "uppercase", letterSpacing: "0.5px"
          }}>
            Room Details
          </p>

          <Field label="Room Type">
            <SelectInput value={form.room_type} onChange={update("room_type")} options={ROOM_TYPES} />
          </Field>

          <Field label="Gender Preference">
            <SelectInput value={form.gender_preference} onChange={update("gender_preference")} options={GENDER_OPTIONS} />
          </Field>

          <Field label="Suitable For">
            <ChipSelect value={form.occupant_type} onChange={update("occupant_type")} options={OCCUPANT_OPTIONS} />
          </Field>

          <div style={{ borderTop: "1px solid #F7F7F7", margin: "24px 0" }} />

          {/* Section: Extras */}
          <p style={{
            margin: "0 0 20px", fontSize: "13px",
            fontWeight: "700", color: "#FF385C",
            textTransform: "uppercase", letterSpacing: "0.5px"
          }}>
            Extras
          </p>

          <Field label="Amenities">
            <TagInput value={form.amenities} onChange={update("amenities")} placeholder="e.g. WiFi, washing machine..." />
          </Field>

          <Field label="Transport Links">
            <TagInput value={form.transport_links} onChange={update("transport_links")} placeholder="e.g. Bluebell Luas, Bus 13..." />
          </Field>

          <Field label="Nearby Places">
            <TagInput value={form.nearby_places} onChange={update("nearby_places")} placeholder="e.g. UCD, St James Hospital..." />
          </Field>

          <div style={{ borderTop: "1px solid #F7F7F7", margin: "24px 0" }} />

          {/* Section: Contact */}
          <p style={{
            margin: "0 0 20px", fontSize: "13px",
            fontWeight: "700", color: "#FF385C",
            textTransform: "uppercase", letterSpacing: "0.5px"
          }}>
            Contact
          </p>

          <Field label="Phone Number">
            <TextInput value={form.contact} onChange={update("contact")} placeholder="+353 87 123 4567" />
          </Field>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#FFF1F2", border: "1px solid #FFD6DC",
            borderRadius: "12px", padding: "14px 18px",
            color: "#E31C5F", fontSize: "14px",
            marginTop: "20px"
          }}>
            {error}
          </div>
        )}

        {/* Publish button */}
        <button
          onClick={handlePublish}
          disabled={loading}
          style={{
            width: "100%", marginTop: "20px",
            background: loading
              ? "#CCCCCC"
              : "linear-gradient(135deg, #FF385C, #E31C5F)",
            color: "white", border: "none",
            borderRadius: "14px", padding: "18px",
            fontSize: "17px", fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center",
            justifyContent: "center", gap: "10px",
            boxShadow: loading ? "none" : "0 4px 16px rgba(255,56,92,0.3)",
            fontFamily: "inherit", transition: "opacity 0.2s"
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >
          {loading ? (
            <>
              <div style={{
                width: "18px", height: "18px",
                border: "2px solid rgba(255,255,255,0.4)",
                borderTopColor: "white", borderRadius: "50%",
                animation: "spin 0.8s linear infinite", flexShrink: 0
              }} />
              Publishing...
            </>
          ) : (
            "Publish Listing"
          )}
        </button>

        <p style={{
          textAlign: "center", fontSize: "12px",
          color: "#AAAAAA", marginTop: "16px"
        }}>
          Your listing will be visible to everyone on BookMyRoom
        </p>
      </div>
    </div>
  );
}