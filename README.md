# Augur live map

A small React + TypeScript app for watching detection events across venues. Events arrive over a live SSE connection and show up on the map as they come in. There are filters for venue, event type, and severity.

## Running it locally

You will need a recent version of Node.js installed.

```bash
npm install
npm run dev
```

Vite will print the local URL in the terminal, normally `http://localhost:5173`.

To make a production build:

```bash
npm run build
```

To run the tests:

```bash
npm test
```

## API URL

The app uses the take-home API by default:

`https://frontend-takehome-server-production.up.railway.app`

To point it at another server, create a `.env` file in the project root:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

The server needs to provide `/api/venues` and `/api/events/stream`.

## A couple notes

The live map is driven by the SSE stream, rather than polling the events endpoint. Events are kept in memory while the page is open and the browser's `EventSource` connection will try to reconnect if the stream drops.
