import { remoteLookup } from "@/lib/data";
import { eventDBName, subeventDBName } from "@/lib/env";
import { EventRecord, SubeventRecord } from "@/types/data";
import { MetadataRecord } from "@/types/metadata";

// lib/data.ts
// Ensure remoteLookup, EventRecord, SubeventRecord, MetadataRecord are correctly imported/defined

export async function getEventMetadata(
  eventId: string,
  slug?: string,
): Promise<MetadataRecord> {
  if (slug) {
    const { data, error } = await remoteLookup<SubeventRecord>(subeventDBName, {
      filters: [
        { column: "event_id", value: eventId },
        { column: "subevent_index", value: slug },
      ],
      isSingle: true,
    });

    if (error) {
      console.error("Error fetching subevent metadata:", error);
      return new MetadataRecord(
        "Error | Seekers Guild",
        "Could not retrieve subevent details. Please try again later.",
      );
    }

    const subevent: SubeventRecord | null = data as SubeventRecord | null;

    const title = subevent?.title || "Subevent Not Found | Seekers Guild";
    const description =
      subevent?.description || "Details for this subevent are not available.";

    return new MetadataRecord(title, description);
  } else {
    const { data, error } = await remoteLookup<EventRecord>(eventDBName, {
      field: "id",
      id: eventId,
      isSingle: true,
    });

    if (error) {
      console.error("Error fetching event metadata:", error);
      return new MetadataRecord(
        "Error | Seekers Guild",
        "Could not retrieve event details. Please try again later.",
      );
    }

    const event: EventRecord | null = data as EventRecord | null;

    const title = event?.title || "Event Not Found | Seekers Guild";
    const description =
      event?.description || "Details for this event are not available.";

    return new MetadataRecord(title, description);
  }
}

export function formatEventDateRange(
  start?: string | null,
  end?: string | null,
): string {
  // Converts Supabase "YYYY-MM-DD HH:MM:SS+00" to ISO
  const toDate = (s?: string | null) => {
    if (!s) return null;
    return new Date(s.replace(" ", "T") + (s.endsWith("+00") ? ":00" : ""));
  };

  const optionsDate: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Manila",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const optionsTime: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Manila",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const startDate = toDate(start);
  const endDate = toDate(end);

  if (!startDate) return "TBA";

  const formattedDate = startDate.toLocaleDateString("en-PH", optionsDate);
  const startTime = startDate.toLocaleTimeString("en-PH", optionsTime);
  const endTime = endDate?.toLocaleTimeString("en-PH", optionsTime);

  const sameDay =
    endDate &&
    startDate.toLocaleDateString("en-PH", optionsDate) ===
      endDate.toLocaleDateString("en-PH", optionsDate);

  if (endDate && sameDay) {
    return `${formattedDate} · ${startTime}–${endTime}`;
  }

  if (endDate && !sameDay) {
    const endDateStr = endDate.toLocaleDateString("en-PH", optionsDate);
    return `${formattedDate} ${startTime} to ${endDateStr} ${endTime}`;
  }

  return `${formattedDate} · ${startTime}`;
}
