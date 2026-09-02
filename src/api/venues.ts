import { apiFetch } from "./client";
import type { Venue } from "../types/api";

export function getVenues(): Promise<Venue[]> {
  return apiFetch<Venue[]>("/api/venues");
}