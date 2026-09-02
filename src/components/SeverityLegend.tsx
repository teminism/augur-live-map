const items = [
  { label: "Low", className: "low" },
  { label: "Medium", className: "medium" },
  { label: "High", className: "high" },
  { label: "Critical", className: "critical" },
];

export function SeverityLegend() {
  return (
    <div className="severity-legend">
      {items.map((item) => (
        <div key={item.label} className="legend-item">
          <span
            className={`legend-dot ${item.className}`}
          />

          {item.label}
        </div>
      ))}
    </div>
  );
}