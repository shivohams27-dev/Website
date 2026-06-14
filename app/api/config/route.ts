import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  const { data, error } = await supabase.from('site_config').select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  if (!(await verifyAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const body = await request.json();
    const { error } = await supabaseAdmin
      .from('site_config')
      .update({
        hero_tagline: body.hero_tagline,
        hero_about: body.hero_about,
        join_lab_url: body.join_lab_url,
        community_description: body.community_description,
        community_url: body.community_url,
        discord_url: body.discord_url,
        whatsapp_url: body.whatsapp_url,
        form_url: body.form_url,
        telegram_url: body.telegram_url,
        custom_links: body.custom_links,
        social_links: body.social_links,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
