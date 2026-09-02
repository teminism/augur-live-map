type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

interface StatusBannerProps {
  status: ConnectionStatus;
  onReconnect: () => void;
}

export function StatusBanner({
  status,
  onReconnect,
}: StatusBannerProps) {
  if (status === "connected") {
    return (
      <div className="connection-status connected">
        <span className="status-dot" />
        Live
      </div>
    );
  }

  if (status === "connecting") {
    return (
      <div className="connection-status connecting">
        Connecting to live stream…
      </div>
    );
  }

  return (
    <div className="connection-status disconnected">
      <span>
        Live stream disconnected. Reconnecting automatically…
      </span>

      <button onClick={onReconnect}>
        Retry now
      </button>
    </div>
  );
}