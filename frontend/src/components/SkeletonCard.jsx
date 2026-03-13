export default function SkeletonCard() {
  return (
    <div style={{
      background: "white", borderRadius: "16px",
      overflow: "hidden", border: "1px solid #EBEBEB"
    }}>
      <div style={{
        height: "180px",
        background: "linear-gradient(90deg, #F0F0F0 25%, #E8E8E8 50%, #F0F0F0 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite"
      }} />
      <div style={{ padding: "16px" }}>
        {[100, 60, 80].map((w, i) => (
          <div key={i} style={{
            height: i === 0 ? "16px" : "12px",
            width: `${w}%`,
            borderRadius: "8px",
            background: "linear-gradient(90deg, #F0F0F0 25%, #E8E8E8 50%, #F0F0F0 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
            marginBottom: "10px"
          }} />
        ))}
      </div>
    </div>
  );
}