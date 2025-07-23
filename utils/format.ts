import { supabase } from "@/lib/supabase";

export async function getEventMetadata(eventId: string, slug?: string) {
  if (slug) {
    const { data: subevent } = await supabase
      .from("testsubevent")
      .select("title, description")
      .eq("event_id", eventId)
      .eq("subevent_index", slug)
      .single();

    return {
      title: subevent?.title ?? "Subevent | Seekers Guild",
      description:
        subevent?.description ??
        "Explore this subevent under Seekers Guild and its partners!",
      icons: {
        icon: "/favicon.ico",
      },
      openGraph: {
        title: subevent?.title ?? "Subevent | Seekers Guild",
        description: subevent?.description ?? "",
        images: ["/og-image.png"], // ← fallback
        // images: subevent?.og_image_url
        //   ? [subevent.og_image_url]
        //   : ['/og-image.png'], // ← fallback
      },
    };
  } else {
    const { data: event } = await supabase
      .from("testevent")
      .select("title, description")
      .eq("id", eventId)
      .single();

    return {
      title: event?.title ?? "Event | Seekers Guild",
      description: event?.description ?? "Join the Seekers Guild event.",
      icons: {
        icon: "/favicon.ico",
      },
      openGraph: {
        title: event?.title ?? "Event | Seekers Guild",
        description: event?.description ?? "",
        images: ["/og-image.png"], // ← fallback
        // images: event?.og_image_url
        //   ? [event.og_image_url]
        //   : ['/og-image.png'],
      },
    };
  }
}

export function formatEventDateRange(
  start?: string | null,
  end?: string | null,
): string {
  if (!start) return "TBA";

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
