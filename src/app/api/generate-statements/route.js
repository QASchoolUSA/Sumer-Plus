export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const body = await req.json();
    const host = req.headers.get('host');
    const protocol = host && host.includes('localhost') ? 'http' : 'https';
    const url = `${protocol}://${host}/api/statement_generator`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      const isHtml = (res.headers.get('content-type') || '').includes('text/html');
      if (!res.ok && isHtml) {
        data = {
          ok: false,
          error:
            'Python serverless endpoint is not available in `next dev`. Use `vercel dev` to run Next.js and Python together.',
          output: text,
        };
      } else {
        data = { ok: res.ok, output: text };
      }
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
