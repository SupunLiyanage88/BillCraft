import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;

    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const db = await getDb();
    const collection = db.collection('invoices');

    if (req.method === 'DELETE') {
      await collection.deleteOne({ id });
      return res.status(200).json({ deleted: true });
    }

    if (req.method === 'GET') {
      const invoice = await collection.findOne({ id });
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
      return res.status(200).json(invoice);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
