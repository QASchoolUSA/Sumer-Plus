export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import sql from 'mssql';

function getConfig() {
  return {
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
}

async function ensureTable(pool) {
  await pool.request().query(`
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
}

export async function POST(req) {
  let pool;
  try {
    const body = await req.json();
    const { unitNumber, driverName, driverEmail, company, ratePerMile } = body || {};
    if (unitNumber == null || typeof unitNumber !== 'number' || !driverName || typeof ratePerMile !== 'number') {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    pool = await sql.connect(getConfig());
    await ensureTable(pool);
    const request = pool.request();
    request.input('unit_number', sql.Int, unitNumber);
    request.input('driver_name', sql.NVarChar(255), driverName);
    request.input('driver_email', sql.NVarChar(255), driverEmail || null);
    request.input('company', sql.NVarChar(255), company || null);
    request.input('rate_per_mile', sql.Decimal(10, 4), ratePerMile);
    await request.query(`
      MERGE dbo.driver_config AS target
      USING (SELECT @unit_number AS unit_number, @driver_name AS driver_name, @driver_email AS driver_email, @company AS company, @rate_per_mile AS rate_per_mile) AS source
      ON target.unit_number = source.unit_number
      WHEN MATCHED THEN
        UPDATE SET driver_name = source.driver_name, driver_email = source.driver_email, company = source.company, rate_per_mile = source.rate_per_mile
      WHEN NOT MATCHED THEN
        INSERT (unit_number, driver_name, driver_email, company, rate_per_mile)
        VALUES (source.unit_number, source.driver_name, source.driver_email, source.company, source.rate_per_mile);
    `);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    if (pool) await pool.close();
  }
}

export async function GET(req) {
  let pool;
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
    pool = await sql.connect(getConfig());
    await ensureTable(pool);
    const request = pool.request();
    request.input('unit_number', sql.Int, unitNumber);
    const result = await request.query(`
      SELECT unit_number, driver_name, driver_email, company, rate_per_mile
      FROM dbo.driver_config
      WHERE unit_number = @unit_number
    `);
    const row = (result.recordset || [])[0] || null;
    return new Response(JSON.stringify({ ok: true, data: row }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    if (pool) await pool.close();
  }
}
