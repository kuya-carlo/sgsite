// app/event/[eventId]/[slug]/page.tsx
import styles from "../event.module.scss";
export const dynamic = "force-dynamic";
import { supabase } from "@/lib/supabase";
import { getEventMetadata, formatEventDateRange } from "@/utils/format";

export type Props = {
  params: Promise<{ eventId: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  return getEventMetadata((await params).eventId, (await params).slug);
}

export default async function SubeventPage({ params }: Props) {
  const { eventId: event_id, slug } = await params;

  const { data: subevent_data, error: subevent_errors } = await supabase
    .from("testsubevent")
    .select("*")
    .eq("event_id", event_id)
    .eq("subevent_index", slug)
    .single();
  console.log(subevent_errors);
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <p>
          <a href=".">&larr; Go Back</a>
        </p>

        <h1>{subevent_data.title}</h1>
        <p className={styles.date}>
          {formatEventDateRange(
            subevent_data.event_start,
            subevent_data.event_end,
          )}
        </p>
      </div>
      <p className={styles.description}>{subevent_data.description}</p>
    </main>
  );
}
