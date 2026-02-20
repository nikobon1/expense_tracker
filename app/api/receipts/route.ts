import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

function getDb() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error('DATABASE_URL is not set');
    }
    return neon(databaseUrl);
}

// Initialize database tables
async function initDb() {
    const sql = getDb();

    await sql`
    CREATE TABLE IF NOT EXISTS receipts (
      id SERIAL PRIMARY KEY,
      store_name TEXT,
      purchase_date DATE,
      total_amount DECIMAL(10, 2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

    await sql`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      receipt_id INTEGER REFERENCES receipts(id),
      name TEXT,
      price DECIMAL(10, 2),
      category TEXT
    )
  `;
}

export async function POST(request: NextRequest) {
    try {
        const { store_name, purchase_date, items } = await request.json();

        if (!store_name || !purchase_date || !items || items.length === 0) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const sql = getDb();

        // Ensure tables exist
        await initDb();

        // Calculate total
        const totalAmount = items.reduce((sum: number, item: { price: number }) => sum + Number(item.price), 0);

        // Insert receipt
        const receiptResult = await sql`
      INSERT INTO receipts (store_name, purchase_date, total_amount)
      VALUES (${store_name}, ${purchase_date}, ${totalAmount})
      RETURNING id
    `;

        const receiptId = receiptResult[0].id;

        // Insert items
        for (const item of items) {
            await sql`
        INSERT INTO items (receipt_id, name, price, category)
        VALUES (${receiptId}, ${item.name}, ${item.price}, ${item.category || 'Другое'})
      `;
        }

        return NextResponse.json({ success: true, receiptId });
    } catch (error) {
        console.error('Save receipt error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to save receipt' },
            { status: 500 }
        );
    }
}
