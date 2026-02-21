import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './_lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await getDb();
    const collection = db.collection('invoices');

    if (req.method === 'GET') {
      const invoices = await collection.find({}).sort({ savedAt: -1 }).toArray();
      return res.status(200).json(invoices);
    }

    if (req.method === 'POST') {
      const body = req.body;

      // Migration: bulk insert invoices and set counter
      if (body.action === 'migrate') {
        const { invoices, counter } = body;
        if (invoices && invoices.length > 0) {
          await collection.insertMany(invoices);
        }
        if (counter !== undefined) {
          const counters = db.collection('counters');
          await counters.updateOne(
            { _id: 'invoice_number' as any },
            { $set: { value: counter } },
            { upsert: true }
          );
        }
        return res.status(200).json({ migrated: invoices?.length || 0 });
      }

      // Clear all invoices
      if (body.action === 'clear') {
        await collection.deleteMany({});
        return res.status(200).json({ cleared: true });
      }

      // Create a single invoice
      await collection.insertOne(body);
      return res.status(201).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
