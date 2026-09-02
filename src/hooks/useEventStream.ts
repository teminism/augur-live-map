import { useCallback, useEffect, useRef, useState } from "react";
import { getApiUrl } from "../api/client";
import type { DetectionEvent } from "../types/api";

const MAX_EVENTS = 500;

type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

interface UseEventStreamResult {
  events: DetectionEvent[];
  status: ConnectionStatus;
  reconnect: () => void;
}

export function useEventStream(): UseEventStreamResult {
  const [events, setEvents] = useState<DetectionEvent[]>([]);
  const [status, setStatus] =
    useState<ConnectionStatus>("connecting");

  const sourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    sourceRef.current?.close();

    setStatus("connecting");

    const source = new EventSource(
      getApiUrl("/api/events/stream")
    );

    sourceRef.current = source;

    source.onopen = () => {
      setStatus("connected");
    };

    source.addEventListener("detection", (message) => {
      try {
        const event = JSON.parse(
          (message as MessageEvent).data
        ) as DetectionEvent;

        setEvents((previous) => {
          if (previous.some((item) => item.id === event.id)) {
            return previous;
          }

          return [event, ...previous].slice(0, MAX_EVENTS);
        });
      } catch (error) {
        console.error(
          "Unable to parse detection event",
          error
        );
      }
    });

    source.onerror = () => {
      setStatus("disconnected");
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      sourceRef.current?.close();
      sourceRef.current = null;
    };
  }, [connect]);

  return {
    events,
    status,
    reconnect: connect,
  };
}