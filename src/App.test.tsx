import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const getVenuesMock = vi.hoisted(() => vi.fn());
const useEventStreamMock = vi.hoisted(() => vi.fn());

vi.mock("./api/venues", () => ({
  getVenues: getVenuesMock,
}));

vi.mock("./hooks/useEventStream", () => ({
  useEventStream: useEventStreamMock,
}));

vi.mock("./components/LiveMap", () => ({
  LiveMap: () => <div data-testid="live-map" />,
}));

const venue = {
  id: "wembley",
  name: "Wembley Stadium",
  center: { lat: 51.556, lng: -0.283 },
  bounds: {
    north: 51.56,
    south: 51.552,
    east: -0.278,
    west: -0.288,
  },
};

const otherVenue = {
  ...venue,
  id: "heathrow",
  name: "Heathrow Airport",
};

describe("App states", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    useEventStreamMock.mockReturnValue({
      events: [],
      status: "connected",
      reconnect: vi.fn(),
    });
  });

  it("shows a loading state while venues are being fetched", () => {
    getVenuesMock.mockReturnValue(new Promise(() => {}));

    render(<App />);

    expect(screen.getByText("Loading venues…")).toBeTruthy();
  });

  it("shows an error state when venues fail to load", async () => {
    getVenuesMock.mockRejectedValueOnce(new Error("API is unavailable"));

    render(<App />);

    expect(await screen.findByText("Unable to load venues")).toBeTruthy();
    expect(screen.getByText("API is unavailable")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Try again" })).toBeTruthy();
  });

  it("shows the waiting state when there are no live events", async () => {
    getVenuesMock.mockResolvedValueOnce([venue]);

    render(<App />);

    expect(await screen.findByText("Waiting for live events")).toBeTruthy();
    expect(screen.getByTestId("live-map")).toBeTruthy();
  });

  it("shows the filtered empty state after events have arrived", async () => {
    getVenuesMock.mockResolvedValueOnce([venue, otherVenue]);
    useEventStreamMock.mockReturnValue({
      events: [
        {
          id: "event-1",
          venueId: "wembley",
          type: "crowd-density",
          severity: "high",
          timestamp: "2026-09-02T12:00:00.000Z",
          position: { lat: 51.556, lng: -0.283 },
        },
      ],
      status: "connected",
      reconnect: vi.fn(),
    });

    render(<App />);

    const venueSelect = await screen.findByLabelText("Venue");
    fireEvent.change(venueSelect, { target: { value: "heathrow" } });

    await waitFor(() => expect(screen.getByText("No matching events")).toBeTruthy());
  });
});
