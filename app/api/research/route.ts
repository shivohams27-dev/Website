import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  const { data, error } = await supabase.from('research_papers').select('*').order('order_index');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!(await verifyAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin.from('research_papers').insert([body]).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await verifyAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const updates = body.map((item: { id: string; order_index: number }) =>
      supabaseAdmin.from('research_papers').update({ order_index: item.order_index }).eq('id', item.id)
    );
    const results = await Promise.all(updates);
    const err = results.find(r => r.error);
    if (err?.error) throw err.error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
