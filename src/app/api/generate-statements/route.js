export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const body = await req.json();
    const host = req.headers.get('host');
    const protocol = host && host.includes('localhost') ? 'http' : 'https';
    const url = `${protocol}://${host}/api/statement_generator`;
    const isSheetsRequest = body && body.action === 'sheets';
    const isTwoFile = body && (body.loads_excel_base64 && body.terms_excel_base64);
    const driverConfigs = (isSheetsRequest || isTwoFile) ? null : await fetchAllDriverConfigs();
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(isSheetsRequest || isTwoFile ? body : { ...body, driver_configs: driverConfigs }),
      cache: 'no-store',
    });
    const text = await res.text();
    try {
      data = JSON.parse(text.trim());
    } catch (parseError) {
      console.error("JSON Parse Error in route.js:", parseError);
      console.log("Failed text start:", text.substring(0, 100));
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

import sql from 'mssql';

async function fetchAllDriverConfigs() {
  const config = {
    server: process.env.SQLSERVER_SERVER,
    database: process.env.SQLSERVER_DATABASE,
    user: process.env.SQLSERVER_USER,
    password: process.env.SQLSERVER_PASSWORD,
    options: {
      encrypt: String(process.env.SQLSERVER_ENCRYPT || 'true') === 'true',
      trustServerCertificate: false,
    },
    pool: { max: 5, min: 0, idleTimeoutMillis: 30000 },
  };
  let pool;
  try {
    pool = await sql.connect(config);
    const tableExists = await pool
      .request()
      .query(`
        IF NOT EXISTS (
          SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[driver_config]') AND type IN (N'U')
        )
        BEGIN
          CREATE TABLE [dbo].[driver_config] (
            unit_number INT PRIMARY KEY,
            driver_name NVARCHAR(255) NOT NULL,
            driver_email NVARCHAR(255) NULL,
            company NVARCHAR(255) NULL,
            rate_per_mile DECIMAL(10,4) NOT NULL
          )
        END
      `);
    const result = await pool.request().query(`
      SELECT unit_number, driver_name, driver_email, company, rate_per_mile
      FROM dbo.driver_config
    `);
    const map = {};
    for (const row of result.recordset || []) {
      const keyStr = String(row.unit_number);
      map[keyStr] = {
        unit_number: row.unit_number,
        driver_name: row.driver_name,
        driver_email: row.driver_email,
        company: row.company,
        rate_per_mile: Number(row.rate_per_mile),
      };
    }
    return map;
  } catch (e) {
    return {};
  } finally {
    if (pool) await pool.close();
  }
}
