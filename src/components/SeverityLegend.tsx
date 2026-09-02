const items = [
  { label: "Low", color: "#3b82f6" },
  { label: "Medium", color: "#f59e0b" },
  { label: "High", color: "#ef4444" },
  { label: "Critical", color: "#7c3aed" },
];

export function SeverityLegend() {
  return (
    <div className="severity-legend">
      {items.map((item) => (
        <div key={item.label} className="legend-item">
          <span
            className="legend-dot"
            style={{ backgroundColor: item.color }}
            aria-label={`${item.label} severity color`}
          />
          {item.label}
        </div>
      ))}
    </div>
  );
}