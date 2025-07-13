// app/event/[eventId]/page.tsx
export const dynamic = 'force-dynamic';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation'; 

type Props = {
  params: Promise<{ eventId: string }>;
};

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
    <main>
      <div>
      <h1>{event_data.title}</h1>
      {event_data.event_date && <p>{event_data.event_date}</p>}
      </div>
      <h2>{event_data.subtitle}</h2>
      <p>{event_data.description}</p>
      {subevent_data.map((subevent: any, i: number) => (
        <p key={i}>
          <a href={`/event/${event_data.id}/${subevent.subevent_index}`}>{subevent.title}</a>
        </p>
        ))}
    </main>
    // should be a array, is actually an object according to js
  );
}