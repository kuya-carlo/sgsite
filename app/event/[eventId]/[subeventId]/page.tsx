// app/event/[eventId]/[subeventId] page.tsx
export const dynamic = "force-dynamic";
import { getSubeventData } from "@/lib/data";
import { SubeventRecord } from "@/types/data";
import { formatEventDateRange, getEventMetadata } from "@/utils/format";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ eventId: string; subeventId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { eventId, subeventId } = await params;
  const metadataRecord = await getEventMetadata(eventId, subeventId);
  return metadataRecord.toNextMetadata();
}

export default async function EventPage({ params }: Props) {
  const { eventId: event_id, subeventId: subevent_id } = await params;
  const { data: rawsubevent, error: subevent_errors } = await getSubeventData(
    event_id,
    parseInt(subevent_id, 10),
  );
  const subevent_data: SubeventRecord | null =
    rawsubevent as SubeventRecord | null;

  console.log(subevent_errors);
  if (!subevent_data) {
    return notFound();
  }
  return (
    <main>
      <header>
        <h1>{subevent_data.title}</h1>
        <p className="date">
          {formatEventDateRange(
            subevent_data.event_start,
            subevent_data.event_end,
          )}
        </p>
      </header>
      <p className="description">{subevent_data.description}</p>
    </main>
  );
}
