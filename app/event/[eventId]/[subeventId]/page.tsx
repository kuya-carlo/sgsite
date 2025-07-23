// app/event/[eventId]/[subeventId] page.tsx
import styles from './event.module.scss';
export const dynamic = 'force-dynamic';
import { supabase } from '@/lib/supabase';
import { formatEventDateRange, getEventMetadata } from '@/utils/format';
import { notFound } from 'next/navigation'; 

type Props = {
  params: Promise<{ eventId: string, subeventId: string }>;
};

export async function generateMetadata({ params }: Props ) {
  const {eventId, subeventId} = await params;
  return getEventMetadata(eventId, subeventId);
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
    <main >
      <header>
        <h1>{event_data.title}</h1>
        <p className="date">
          {formatEventDateRange(event_data.event_start, event_data.event_end)}
        </p>
      </header>
      <h2 className="subtitle">{event_data.subtitle}</h2>
      <p className="description">{event_data.description}</p>
      <div className="subeventList">
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