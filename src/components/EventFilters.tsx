import type {
  DetectionEvent,
  EventFilters as Filters,
  Venue,
} from "../types/api";

interface EventFiltersProps {
  venues: Venue[];
  events: DetectionEvent[];
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function EventFilters({
  venues,
  events,
  filters,
  onChange,
}: EventFiltersProps) {
  const eventTypes = [
    ...new Set(events.map((event) => event.type)),
  ].sort();

  const severities = [
    ...new Set(events.map((event) => event.severity)),
  ].sort();

  return (
    <div className="filters">
      <label>
        Venue
        <select
          value={filters.venueId}
          onChange={(event) =>
            onChange({
              ...filters,
              venueId: event.target.value,
            })
          }
        >
          <option value="">All venues</option>

          {venues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Event type
        <select
          value={filters.type}
          onChange={(event) =>
            onChange({
              ...filters,
              type: event.target.value,
            })
          }
        >
          <option value="">All types</option>

          {eventTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label>
        Severity
        <select
          value={filters.severity}
          onChange={(event) =>
            onChange({
              ...filters,
              severity: event.target.value,
            })
          }
        >
          <option value="">All severities</option>

          {severities.map((severity) => (
            <option key={severity} value={severity}>
              {severity}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}