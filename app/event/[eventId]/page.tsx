// app/event/[eventId]/page.tsx
import styles from './event.module.scss';
export const dynamic = 'force-dynamic';
import { supabase } from '@/lib/supabase';
import { formatEventDateRange, getEventMetadata } from '@/utils/format';
import { notFound } from 'next/navigation'; 

type Props = {
  params: Promise<{ eventId: string }>;
};

export async function generateMetadata({ params }: Props ) {
  return getEventMetadata((await params).eventId);
}

export default async function EventPage({ params }: Props) {
  const { eventId: event_id } = await params;
  
  const { data: event_data, error: event_errors } = await supabase
    .from('testevent')
    .select('*')
    .eq('id', event_id).single();
  const { data: subevent_data, error: subevent_errors } = await supabase
    .from('testsubevent').select('*')
    .eq('event_id', event_id);
  
  if (!event_data) {
    return notFound();
  }
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>{event_data.title}</h1>
        <p className={styles.date}>
          {formatEventDateRange(event_data.event_start, event_data.event_end)}
        </p>
      </div>
      <h2 className={styles.subtitle}>{event_data.subtitle}</h2>
      <p className={styles.description}>{event_data.description}</p>
      <div className={styles.subeventList}>
      {subevent_data.map((subevent: any, i: number) => (
          <a key={i}
          href={`/event/${event_data.id}/${subevent.subevent_index}`}>
            {subevent.title}
          </a>
        ))}
      </div>
    </main>
  );
}