// Vercel Serverless Function & Cron Handler to keep Supabase Free Tier project permanently active
export default async function handler(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vehvndduipgzjnksbdit.supabase.co';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_hiEbLMumWBGvgaHS9FUtiA_Xjs1NiDe';

  const nowIso = new Date().toISOString();
  const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/nunssup_store_data?on_conflict=channel_id`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify({
        channel_id: 'nunssup_keepalive_ping',
        data: {
          ping: true,
          updatedAt: nowIso,
          source: 'vercel-cron-keepalive',
        },
        updated_at: nowIso,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ ok: false, error: errText, timestamp: nowIso });
    }

    return res.status(200).json({
      ok: true,
      message: 'Supabase keep-alive heartbeat recorded successfully',
      timestamp: nowIso,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error?.message || String(error),
      timestamp: nowIso,
    });
  }
}
