// app/event/[eventId]/[slug]/page.tsx
export const dynamic = 'force-dynamic';
import { supabase } from '@/lib/supabase';

type Props = {
  params: Promise<{ eventId: string; slug: string }>;
};

export default async function EventSubPage({ params }: Props) {
  const { eventId: event_id, slug } = await params;

  const { data: subevent_data, error: subevent_errors } = await supabase
    .from('testsubevent').select('*')
    .eq('event_id', event_id).eq('subevent_index', slug).single();
  return (
    <main>
      <h1>{subevent_data.title}</h1>
      <h2><a href=".">Header Event</a></h2>
      <p>{subevent_data.description}</p>
    </main>
  );
}
