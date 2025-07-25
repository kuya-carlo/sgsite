// app/event/[eventId]/page.tsx
export const dynamic = "force-dynamic";
import { getEventData, getImageUrl, getSubeventData } from "@/lib/data";
import { EventRecord, SubeventRecord } from "@/types/data";
import { formatEventDateRange, getEventMetadata } from "@/utils/format";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ eventId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const metadataRecord = await getEventMetadata((await params).eventId);
  return metadataRecord.toNextMetadata();
}

export default async function EventPage({ params }: Props) {
  const { eventId: event_id } = await params;
  const { data: rawevent, error: event_errors } = await getEventData(event_id);
  const event_data: EventRecord | null = rawevent as EventRecord | null;
  const { data: rawsubevent, error: subevent_errors } = await getSubeventData(event_id);
  const subevent_data: SubeventRecord[] | null = rawsubevent as
    | SubeventRecord[]
    | null;

  const imageUrl = await getImageUrl("event-pics", event_id + ".svg");
  console.log(event_errors, subevent_errors);

  if (!event_data) {
    return notFound();
  } else {
    return (
      <main>
        <header>
          {imageUrl && <img src={imageUrl} alt={event_data.title} />}
          <h1>{event_data.title}</h1>
          <p className="date">
            {formatEventDateRange(event_data.event_start, event_data.event_end)}
          </p>
        </header>
        <h2 className="subtitle">{event_data.subtitle}</h2>
        <p className="description">{event_data.description}</p>
        <div className="subevent-list">
          {subevent_data.map((subevent: any, i: number) => (
            <a
              key={i}
              href={`/event/${event_data.id}/${subevent.subevent_index}`}
            >
              {subevent.title}
            </a>
          ))}
        </div>
      </main>
    );
  }
}
