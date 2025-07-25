// app/api/events
import { NextResponse } from "next/server";
import { remoteLookup } from "@/lib/data";
import { EventRecord } from "@/types/data";
import { eventDBName } from "@/lib/env";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  if (isNaN(limit) || limit < 0) {
    return NextResponse.json(
      {
        result: "error",
        errors: [
          {
            status: 400,
            title: "Bad Request",
            detail: "Invalid 'limit' parameter. Must be a non-negative number.",
            context: null,
          },
        ],
      },
      { status: 400 },
    );
  }
  if (isNaN(offset) || offset < 0) {
    return NextResponse.json(
      {
        result: "error",
        errors: [
          {
            status: 400,
            title: "Bad Request",
            detail:
              "Invalid 'offset' parameter. Must be a non-negative number.",
            context: null,
          },
        ],
      },
      { status: 400 },
    );
  }

  const { data, error } = await remoteLookup<EventRecord>(eventDBName, {
    limit: limit,
    offset: offset,
  });
  console.log(error);

  const event_data: EventRecord[] | null = data as EventRecord[] | null;
  // console.log("Events: ", data);
  console.log(error);
  return NextResponse.json({
    result: "ok",
    response: event_data.length === 1 ? "entry" : "collection",
    data: event_data,
  });
}
