import type {
  DetectionEvent,
  EventFilters,
} from "../types/api";

export function filterEvents(
  events: DetectionEvent[],
  filters: EventFilters
): DetectionEvent[] {
  return events.filter((event) => {
    if (
      filters.venueId &&
      event.venueId !== filters.venueId
    ) {
      return false;
    }

    if (
      filters.type &&
      event.type !== filters.type
    ) {
      return false;
    }

    if (
      filters.severity &&
      event.severity !== filters.severity
    ) {
      return false;
    }

    return true;
  });
}

export function getUniqueEventTypes(
  events: DetectionEvent[]
): string[] {
  return [...new Set(events.map((event) => event.type))].sort();
}

export function getUniqueSeverities(
  events: DetectionEvent[]
): string[] {
  return [...new Set(events.map((event) => event.severity))].sort();
}