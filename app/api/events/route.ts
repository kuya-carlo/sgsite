// app/api/events
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    const { data, error } = await supabase
    .from('testevent')
    .select('*')
    .limit(5);
    console.log('Events: ', data);
    if ( error ) {
        return NextResponse.json(
            {   result: 'error', 
                errors: [{
                    status: error.code,
                    title: error.message,
                    detail: error.details,
                    context: error.hint
                }]
            }
            // {error: 'Failed to fetch events', details: error.message}
        )
    }
    if (!data || data.length === 0) {
        return NextResponse.json({
                result: 'error', 
                errors: [{
                    status: 404,
                    title: "Event not found",
                    detail: 'No entry found in the database',
                    context: null
                }]
            })
    }
    return NextResponse.json({
        result: 'ok',
        response: data.length === 1 ? 'entry' : 'collection',
        data: data
    })
}