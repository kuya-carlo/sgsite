// app/event/[eventId]/page.tsx
export const dynamic = 'force-dynamic';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation'; 

type Props = {
  params: Promise<{ eventId: string }>;
};

export default async function EventPage({ params }: Props) {
  const { eventId: event_id } = await params;
  
  // Debug logging
  // console.log('Looking for eventId:', eventId, 'Type:', typeof eventId);
  
  // console.log('All data in testdata table:', allData);
  // console.log('All error:', allError);
  
  // console.log('Specific query result:', { data, error });
  
  const { data, error } = await supabase
    .from('testevent')
    .select('*')
    .eq('id', event_id).single();
  
  // console.log('Query without .single():', { dataArray, errorArray });
  
  // if (error) {
  //   console.error('Supabase error:', error);
  //   return <main>
  //     <p>Error loading event: {error.message}</p>
  //     <p>Error code: {error.code}</p>
  //     <p>Looking for ID: {eventId}</p>
  //     <p>Available IDs: {allData?.map(item => `"${item.id}"`).join(', ')}</p>
  //   </main>;
  // }
  
  if (!data) {
    return notFound();
  }
  // console.log(data.subevent, typeof data.subevent, Array.isArray(data.subevent))
  return (
    <main>
      <h1>{data.title}</h1>
      <h2>{data.subtitle}</h2>
      <p>{data.description}</p>
      {data.subevent.map((element: string, i: number) => (
        <p key={i}>
          <a href={`/event/${data.id}/${element}`}>{element}</a>
        </p>
        ))}
    </main>
    // should be a array, is actually an object according to js
  );
}