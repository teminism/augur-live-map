import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import type {
  DetectionEvent,
  Severity,
  Venue,
} from "../types/api";

interface LiveMapProps {
  venues: Venue[];
  events: DetectionEvent[];
  selectedVenue?: Venue;
}

interface MapViewportProps {
  venue?: Venue;
}

function MapViewport({ venue }: MapViewportProps) {
  const map = useMap();

  useEffect(() => {
    if (!venue) {
      return;
    }

    map.fitBounds(
      [
        [venue.bounds.south, venue.bounds.west],
        [venue.bounds.north, venue.bounds.east],
      ],
      {
        padding: [24, 24],
        maxZoom: 16,
      }
    );
  }, [map, venue]);

  return null;
}

const severityRadius: Record<Severity, number> = {
  low: 7,
  medium: 9,
  high: 11,
  critical: 14,
};

const severityColor: Record<Severity, string> = {
  low: "#3b82f6",
  medium: "#f59e0b",
  high: "#ef4444",
  critical: "#7c3aed",
};

export function LiveMap({
  venues,
  events,
  selectedVenue,
}: LiveMapProps) {
  const fallbackCenter: [number, number] =
    venues.length > 0
      ? [venues[0].center.lat, venues[0].center.lng]
      : [51.5074, -0.1278];

  return (
    <div className="map-container">
      <MapContainer
        center={fallbackCenter}
        zoom={13}
        scrollWheelZoom
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapViewport venue={selectedVenue} />

        {events.map((event) => {
          const venue = venues.find(
            (venue) => venue.id === event.venueId
          );

          if (!venue) {
            return null;
          }

          return (
            <CircleMarker
              key={event.id}
              center={[event.position.lat, event.position.lng]}
              radius={severityRadius[event.severity]}
              pathOptions={{
                color: severityColor[event.severity],
                fillColor:
                  severityColor[event.severity],
                fillOpacity: 0.75,
                weight: 2,
              }}
            >
              <Popup>
                <div className="event-popup">
                  <strong>{event.type}</strong>

                  <span>
                    Venue: {venue.name}
                  </span>

                  <span>
                    Severity: {event.severity}
                  </span>

                  <span>
                    {new Date(
                      event.timestamp
                    ).toLocaleString()}
                  </span>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}