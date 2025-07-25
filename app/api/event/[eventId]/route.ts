// app/api/event/[eventId]
import { NextResponse } from "next/server";
import { EventRecord } from "@/types/data";
import { eventDBName } from "@/lib/env";
import { getEventData, remoteLookup } from "@/lib/data";

type Props = {
  params: Promise<{ eventId: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { eventId: event_id } = await params;
  const { data: rawevent, error: event_errors } = await getEventData(event_id);
  const event_data: EventRecord | null = rawevent as EventRecord | null;
  console.log(event_errors);
  return NextResponse.json({
    result: "ok",
    response: "entry",
    data: event_data,
  });
}
