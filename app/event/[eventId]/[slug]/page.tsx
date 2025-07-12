// app/event/[eventId]/[slug]/page.tsx
export const dynamic = 'force-dynamic';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation'; 

type Props = {
  params: Promise<{ eventId: string; slug: string }>;
};

export default async function EventSubPage({ params }: Props) {
  const { eventId: event_id, slug } = await params;

  const { data, error } = await supabase
    .from('testsubevent')
    .select('*')
    .eq('event_id', event_id)
    .eq('subevent_index', slug).single();
  return (
    <main>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </main>
  );
}
