export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { headers } from 'next/headers';

export async function GET() {
  try {
    const host = headers().get('host');
    const protocol = host && host.includes('localhost') ? 'http' : 'https';
    const url = `${protocol}://${host}/api/statement_generator`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { ok: res.ok, output: text };
    }
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
