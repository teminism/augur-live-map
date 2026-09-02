export type Severity = "low" | "medium" | "high" | "critical";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface Venue {
  id: string;
  name: string;
  center: Coordinates;
  bounds: Bounds;
}

export interface DetectionEvent {
  id: string;
  venueId: string;
  type: string;
  severity: Severity;
  timestamp: string;
  location: Coordinates;
}

export interface EventFilters {
  venueId: string;
  type: string;
  severity: string;
}