// lib/data.ts
// Contains functions that gather data
// either from Supabase or data/offline-data,ts
import { createClient } from "@supabase/supabase-js";
import type { PostgrestError } from "@supabase/supabase-js";
// Assuming these types/classes are defined in '@/types/data'
import {
  EventModel,
  SubEventModel,
  APIError,
  EventRecord,
  SubeventRecord,
} from "@/types/data";
// Assuming these environment variables are defined
import { eventDBName, subeventDBName, isOnline } from "./env";
// Assuming these are your offline data arrays
import { events, subevents } from "../data/offline-data";

// === Supabase Client ===
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
if (!supabaseUrl || !supabaseAnonKey)
  throw new Error("Supabase env vars are not defined.");
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// === Helpers ===
// Ensure Event.from and SubEvent.from methods correctly return the Record type
// or convert them if necessary. Assuming they are meant to create instances of Event/SubEvent classes.
function buildEvent(obj: EventRecord): EventRecord {
  // Changed return type to Event class instance
  return EventModel.from(obj);
}
function buildSubevent(obj: SubeventRecord): SubeventRecord {
  // Changed return type to SubEvent class instance
  return SubEventModel.from(obj);
}

export async function getImageUrl(
  bucket: string,
  filename: string,
): Promise<string> {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
  return data.publicUrl;
}

export async function remoteLookup<T extends EventRecord | SubeventRecord>(
  db: string,
  opts?: {
    id?: string | number; // Updated: id can be string or number
    field?: string;
    filters?: { column: string; value: any }[];
    limit?: number;
    offset?: number;
    isSingle?: boolean;
  },
): Promise<{ data: T | T[] | null; error: PostgrestError | null }> {
  const effectiveOpts = {
    id: undefined,
    field: "id",
    filters: [],
    limit: 5,
    offset: 0,
    isSingle: false,
    ...opts,
  };

  const { id, field, filters, limit, offset, isSingle } = effectiveOpts;

  let query = supabase.from(db).select("*");

  // Apply filters. If `id` is provided, it acts as one of the filters.
  // Ensure the `value` in `eq` matches the expected type of the column.
  if (id !== undefined) {
    query = query.eq(field, id);
  }
  filters.forEach((f) => {
    query = query.eq(f.column, f.value);
  });

  if (isSingle) {
    const { data, error } = await query.single();

    if (error) {
      console.error(`Supabase error during single lookup on '${db}':`, error);
      return { data: null, error };
    }
    return { data: data as T | null, error: null };
  } else {
    query = query.range(offset, offset + limit - 1);
    const { data, error } = await query;

    if (error) {
      console.error(`Supabase error during range lookup on '${db}':`, error);
      return { data: null, error };
    }
    return { data: (data as T[] | null) ?? [], error: null };
  }
}

// === Event Data ===
export async function getEventData(
  event_id?: string,
  limit: number = 5,
  offset: number = 0,
): Promise<{
  data: EventRecord | EventRecord[] | null;
  error: APIError | null;
}> {
  // Changed return type to Event | Event[] | null

  if (isOnline) {
    try {
      if (event_id) {
        const { data: rawEventData, error: lookupError } =
          await remoteLookup<EventRecord>(eventDBName, {
            field: "id",
            id: event_id,
            isSingle: true,
          });

        if (lookupError) {
          return { data: null, error: APIError.from(lookupError) };
        }
        if (!rawEventData) {
          return {
            data: null,
            error: new APIError("Event not found", {
              code: "404",
              context: `Online ID: ${event_id}`,
            }),
          };
        }

        const event: EventRecord = rawEventData as EventRecord;
        return { data: buildEvent(event), error: null };
      } else {
        const { data: rawEventsListData, error: lookupError } =
          await remoteLookup<EventRecord>(eventDBName, {
            limit: limit,
            offset: offset,
            isSingle: false,
          });

        if (lookupError) {
          return { data: null, error: APIError.from(lookupError) };
        }

        const eventsList: EventRecord[] =
          (rawEventsListData as EventRecord[] | null) ?? [];
        return { data: eventsList.map(buildEvent), error: null };
      }
    } catch (err) {
      return {
        data: null,
        error: new APIError("Unexpected online data fetch error", {
          code: "500",
          details: (err as Error)?.message,
          cause: err,
        }),
      };
    }
  } else {
    if (event_id) {
      const entry = events.find((entry) => entry.id === event_id);
      if (!entry) {
        return {
          data: null,
          error: new APIError("Event not found (offline)", {
            code: "404",
            context: `Offline ID: ${event_id}`,
          }),
        };
      }
      return { data: buildEvent(entry), error: null };
    } else {
      const startIndex = offset;
      const endIndex = offset + limit;
      const effectiveStartIndex = Math.max(0, startIndex);
      const paginatedOfflineEvents = events.slice(
        effectiveStartIndex,
        endIndex,
      );

      return {
        data: paginatedOfflineEvents.map(buildEvent),
        error: null,
      };
    }
  }
}

// === Subevent Data ===
export async function getSubeventData(
  event_id: string, // Parent event_id is always required for subevents
  subevent_id?: number, // FIX: Changed type to number | undefined
  limit: number = 5,
  offset: number = 0,
): Promise<{
  data: SubeventRecord | SubeventRecord[] | null;
  error: APIError | null;
}> {
  if (isOnline) {
    try {
      if (subevent_id !== undefined) {
        // FIX: Check for undefined explicitly
        const { data: rawSubeventData, error: lookupError } =
          await remoteLookup<SubeventRecord>(subeventDBName, {
            filters: [
              { column: "id", value: subevent_id }, // FIX: subevent_id is passed as number
              { column: "event_id", value: event_id },
            ],
            isSingle: true,
          });

        if (lookupError)
          return { data: null, error: APIError.from(lookupError) };

        if (!rawSubeventData) {
          return {
            data: null,
            error: new APIError("Subevent not found", {
              code: "404",
              hint: `Online single lookup: event_id=${event_id}, subevent_id=${subevent_id}`,
            }),
          };
        }
        const subevent: SubeventRecord = rawSubeventData as SubeventRecord;
        return { data: buildSubevent(subevent), error: null };
      }

      const { data: rawSubeventsListData, error: lookupError } =
        await remoteLookup<SubeventRecord>(subeventDBName, {
          filters: [{ column: "event_id", value: event_id }], // Filter by parent event_id
          limit: limit,
          offset: offset,
          isSingle: false, // Request an array of items
        });

      if (lookupError) return { data: null, error: APIError.from(lookupError) }; // FIX: ternary for error
      const subeventsList: SubeventRecord[] =
        (rawSubeventsListData as SubeventRecord[] | null) ?? [];
      return { data: subeventsList.map(buildSubevent), error: null };
    } catch (err) {
      return {
        data: null,
        error: new APIError("Unexpected error", {
          code: "500",
          details: (err as Error).message,
        }),
      };
    }
  } else {
    // === Offline fallback ===
    if (subevent_id !== undefined) {
      // FIX: Check for undefined explicitly
      // --- OFFLINE: Fetch Single Subevent by subevent_id (number) and event_id ---
      const match = subevents.find(
        (s) => s.id === subevent_id && s.event_id === event_id, // FIX: Direct comparison for numbers
      );
      return match
        ? { data: buildSubevent(match), error: null }
        : {
            data: null,
            error: new APIError("Subevent not found (offline)", {
              code: "404",
              context: `Offline single lookup: event_id=${event_id}, subevent_id=${subevent_id}`,
            }),
          };
    } else {
      // --- OFFLINE: Fetch Multiple Subevents by event_id with Limit and Offset ---
      const startIndex = offset;
      const endIndex = offset + limit;

      const filteredAndPaginated = subevents
        .filter((s) => s.event_id === event_id) // First filter by parent event_id
        .slice(Math.max(0, startIndex), endIndex) // Then apply pagination
        .map(buildSubevent);

      return { data: filteredAndPaginated, error: null };
    }
  }
}
