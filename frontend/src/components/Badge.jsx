export default function Badge({ children, color = "#717171", bg = "#F7F7F7" }) {
  return (
    <span style={{
      background: bg, color,
      fontSize: "11px", fontWeight: "600",
      padding: "4px 10px", borderRadius: "20px",
      display: "inline-flex", alignItems: "center", gap: "4px",
      whiteSpace: "nowrap"
    }}>
      {children}
    </span>
  );
}