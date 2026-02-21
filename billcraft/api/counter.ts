import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './_lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await getDb();
    const collection = db.collection('counters');

    if (req.method === 'GET') {
      const doc = await collection.findOne({ _id: 'invoice_number' as any });
      return res.status(200).json({ value: doc?.value ?? 1 });
    }

    if (req.method === 'POST') {
      // Increment and return
      const result = await collection.findOneAndUpdate(
        { _id: 'invoice_number' as any },
        { $inc: { value: 1 } },
        { upsert: true, returnDocument: 'after' }
      );
      return res.status(200).json({ value: result?.value ?? 2 });
    }

    if (req.method === 'PUT') {
      const { value } = req.body;
      if (typeof value !== 'number') {
        return res.status(400).json({ error: 'value must be a number' });
      }
      await collection.updateOne(
        { _id: 'invoice_number' as any },
        { $set: { value } },
        { upsert: true }
      );
      return res.status(200).json({ value });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
