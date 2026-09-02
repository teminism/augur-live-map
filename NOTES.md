# Notes

## Key decisions

### Native EventSource for the live stream

I used the browser's native `EventSource` API instead of adding another SSE package. It is well supported, keeps the implementation pretty small, and gives us reconnection behaviour out of the box.

The SSE lifecycle lives in `useEventStream`, which handles:

- Connection status
- Parsing `detection` messages
- Disconnect feedback and retry
- Cleanup when the component unmounts
- Deduplicating events
- Keeping a limited history in memory

### The stream is the source of truth

The live map is populated only from `/api/events/stream`. I did not use the range endpoint to fill the map, since the brief says the stream is the source of truth for the live view.

This also keeps historical analytics data separate from what is happening right now. The range endpoint would make sense for a future analytics screen, but not for the live map itself.

### Filtering on the client

The API supports filters on the SSE endpoint, but I kept one unfiltered connection and apply the venue, type, and severity filters in the browser.

That means changing a filter is instant and does not need to tear down and recreate the stream. The trade-off is that this approach is better for the size of this exercise than it would be for a very high volume production stream. At that point I would look at server-side filters or a more deliberate event store.

### Bounded event history

A live connection could keep running for a long time, so keeping every event forever would eventually cause memory and rendering problems. The client keeps the 500 most recent events instead. It gives the operator some useful recent context without allowing the list to grow forever.

### Small component boundaries

I kept the structure fairly small and local:

- `LiveMap` handles the Leaflet map and event markers
- `EventFilters` handles the filter controls
- `SeverityLegend` explains the marker colours
- `StatusBanner` shows the stream connection state
- `useEventStream` owns the SSE connection and event history

I did not add global state management because the state is limited to this page and the extra abstraction did not feel necessary yet.

## What I would do with more time

### Add an analytics view

I would add a separate analytics view using the historical `/api/events` range endpoint. It could include:

- Events by venue
- Events by type
- Severity breakdown
- A time-series chart
- A selectable date range

I would keep this separate from the live map because the two endpoints represent different kinds of data.

### Testing

There is a small test suite covering the main state and stream behaviour:

- Unit tests for event filtering
- Tests for SSE parsing and duplicate events
- Component tests for loading, error, and empty states
- A mocked `EventSource` for connection and malformed payload behaviour

With more time, I would add broader integration coverage around reconnect timing and map interactions.

### Improve the map experience

A few useful improvements would be:

- Focusing the map when a venue is selected
- Using venue bounds when fitting the map view
- Marker clustering when events get dense
- Fading older events so recent activity is easier to spot
- A small animation when a new event arrives

### Production observability

For a production version I would add client-side error reporting, reconnect counters, connection metrics, and some measure of stream latency. Those would make connection problems easier to investigate instead of relying only on the status shown in the UI.

### Accessibility

I would spend more time on keyboard focus states, ARIA labels, and a non-map alternative such as a recent-events table. Severity currently has both colour and text, but a table would make the event feed more useful for people who cannot use the map easily.
