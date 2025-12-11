export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { sql } from '@vercel/postgres';

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      unitNumber,
      driverName,
      driverEmail,
      company,
      ratePerMile,
    } = body || {};

    if (
      unitNumber == null ||
      typeof unitNumber !== 'number' ||
      !driverName ||
      typeof ratePerMile !== 'number'
    ) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await sql`
      CREATE TABLE IF NOT EXISTS driver_config (
        unit_number INTEGER PRIMARY KEY,
        driver_name TEXT NOT NULL,
        driver_email TEXT,
        company TEXT,
        rate_per_mile NUMERIC NOT NULL
      )
    `;

    await sql`
      INSERT INTO driver_config (unit_number, driver_name, driver_email, company, rate_per_mile)
      VALUES (${unitNumber}, ${driverName}, ${driverEmail || null}, ${company || null}, ${ratePerMile})
      ON CONFLICT (unit_number)
      DO UPDATE SET
        driver_name = EXCLUDED.driver_name,
        driver_email = EXCLUDED.driver_email,
        company = EXCLUDED.company,
        rate_per_mile = EXCLUDED.rate_per_mile
    `;

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const unitParam = searchParams.get('unit');
    if (!unitParam) {
      return new Response(JSON.stringify({ ok: false, error: 'unit required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const unitNumber = Number(unitParam);
    const { rows } = await sql`
      SELECT unit_number, driver_name, driver_email, company, rate_per_mile
      FROM driver_config
      WHERE unit_number = ${unitNumber}
      LIMIT 1
    `;
    const row = rows[0];
    return new Response(JSON.stringify({ ok: true, data: row || null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
