import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useEventStream } from "./useEventStream";
import type { DetectionEvent } from "../types/api";

class MockEventSource {
  static instances: MockEventSource[] = [];
  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  closed = false;
  private listeners = new Map<string, (event: MessageEvent) => void>();

  constructor() {
    MockEventSource.instances.push(this);
  }

  addEventListener(type: string, listener: (event: MessageEvent) => void) {
    this.listeners.set(type, listener);
  }

  close() {
    this.closed = true;
  }

  emit(type: string, data = "") {
    this.listeners.get(type)?.(new MessageEvent(type, { data }));
  }
}

const event: DetectionEvent = {
  id: "event-1",
  venueId: "wembley",
  type: "crowd-density",
  severity: "high",
  timestamp: "2026-09-02T12:00:00.000Z",
  position: { lat: 51.556, lng: -0.283 },
};

describe("useEventStream", () => {
  beforeEach(() => {
    MockEventSource.instances = [];
    vi.stubGlobal("EventSource", MockEventSource);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("tracks connection state and deduplicates events", async () => {
    const { result } = renderHook(() => useEventStream());
    const source = MockEventSource.instances[0];

    expect(result.current.status).toBe("connecting");

    act(() => {
      source.onopen?.();
      source.emit("detection", JSON.stringify(event));
      source.emit("detection", JSON.stringify(event));
    });

    await waitFor(() => expect(result.current.status).toBe("connected"));
    expect(result.current.events).toEqual([event]);

    act(() => {
      source.onerror?.();
    });

    expect(result.current.status).toBe("disconnected");
  });

  it("ignores malformed event payloads", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() => useEventStream());
    const source = MockEventSource.instances[0];

    act(() => {
      source.emit("detection", "not valid json");
    });

    expect(result.current.events).toEqual([]);
    expect(consoleError).toHaveBeenCalledOnce();
    consoleError.mockRestore();
  });
});
