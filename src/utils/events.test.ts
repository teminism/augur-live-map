import { describe, expect, it } from "vitest";
import { filterEvents } from "./events";
import type { DetectionEvent } from "../types/api";

const events: DetectionEvent[] = [
  {
    id: "event-1",
    venueId: "wembley",
    type: "crowd-density",
    severity: "high",
    timestamp: "2026-09-02T12:00:00.000Z",
    position: { lat: 51.556, lng: -0.283 },
  },
  {
    id: "event-2",
    venueId: "heathrow",
    type: "unattended-object",
    severity: "medium",
    timestamp: "2026-09-02T12:01:00.000Z",
    position: { lat: 51.47, lng: -0.454 },
  },
];

describe("filterEvents", () => {
  it("returns every event when no filters are selected", () => {
    expect(
      filterEvents(events, { venueId: "", type: "", severity: "" })
    ).toEqual(events);
  });

  it("applies venue, type, and severity filters together", () => {
    expect(
      filterEvents(events, {
        venueId: "wembley",
        type: "crowd-density",
        severity: "high",
      })
    ).toEqual([events[0]]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(
      filterEvents(events, { venueId: "wembley", type: "unattended-object", severity: "" })
    ).toEqual([]);
  });
});
