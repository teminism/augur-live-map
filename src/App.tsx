import { useEffect, useMemo, useState } from 'react';
import { getVenues } from './api/venues';
import { EventFilters } from './components/EventFilters';
import { LiveMap } from './components/LiveMap';
import { SeverityLegend } from './components/SeverityLegend';
import { StatusBanner } from './components/StatusBanner';
import { useEventStream } from './hooks/useEventStream';
import type { EventFilters as Filters, Venue } from './types/api';
import { filterEvents } from './utils/events';

const initialFilters: Filters = {
  venueId: '',
  type: '',
  severity: '',
};

export default function App() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venuesLoading, setVenuesLoading] = useState(true);
  const [venuesError, setVenuesError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const { events, status, reconnect } = useEventStream();

  // Load venues on mount
  useEffect(() => {
    async function loadVenues() {
      try {
        setVenuesLoading(true);
        setVenuesError(null);
        const data = await getVenues();
        setVenues(data);
      } catch (error) {
        setVenuesError(error instanceof Error ? error.message : 'Unable to load venues');
      } finally {
        setVenuesLoading(false);
      }
    }

    loadVenues();
  }, []);

  // Apply filters to events
  const filteredEvents = useMemo(() => filterEvents(events, filters), [events, filters]);

  // Check if we've received any events yet
  const hasReceivedEvents = events.length > 0;

  // Determine empty state message
  const emptyMessage = !hasReceivedEvents
    ? {
        title: 'Waiting for live events',
        description: 'Detection events will appear here as they arrive.',
      }
    : {
        title: 'No matching events',
        description: 'Try adjusting your filters.',
      };

  // Loading state
  if (venuesLoading) {
    return (
      <main className="app-state">
        <div className="spinner" />
        <p>Loading venues…</p>
      </main>
    );
  }

  // Error state
  if (venuesError) {
    return (
      <main className="app-state">
        <h1>Unable to load venues</h1>
        <p>{venuesError}</p>
        <button onClick={() => window.location.reload()}>Try again</button>
      </main>
    );
  }

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">AUGUR</p>
          <h1>Live detection map</h1>
          <p className="subtitle">Real-time operational intelligence across venues</p>
        </div>
        <StatusBanner status={status} onReconnect={reconnect} />
      </header>

      <section className="controls">
        <EventFilters
          venues={venues}
          events={events}
          filters={filters}
          onChange={setFilters}
        />
        <div className="event-count">
          Showing {filteredEvents.length} event{filteredEvents.length === 1 ? '' : 's'}
        </div>
      </section>

      <SeverityLegend />

      <section className="map-section">
        {filteredEvents.length === 0 && (
          <div className="empty-overlay">
            <strong>{emptyMessage.title}</strong>
            <span>{emptyMessage.description}</span>
          </div>
        )}
        <LiveMap venues={venues} events={filteredEvents} />
      </section>
    </main>
  );
}