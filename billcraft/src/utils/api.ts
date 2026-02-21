import type { SavedInvoice } from '../types/invoice';

const STORAGE_KEY = 'billcraft_invoice_history';
const INVOICE_NUMBER_KEY = 'billcraft_invoice_number';

export const saveInvoiceToHistory = async (invoice: SavedInvoice): Promise<void> => {
  const res = await fetch('/api/invoices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoice),
  });
  if (!res.ok) {
    throw new Error('Failed to save invoice to history');
  }
};

export const getInvoiceHistory = async (): Promise<SavedInvoice[]> => {
  try {
    const res = await fetch('/api/invoices');
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error loading invoice history:', error);
    return [];
  }
};

export const getInvoiceById = async (id: string): Promise<SavedInvoice | null> => {
  try {
    const res = await fetch(`/api/invoices/${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error loading invoice:', error);
    return null;
  }
};

export const deleteInvoiceFromHistory = async (id: string): Promise<void> => {
  const res = await fetch(`/api/invoices/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete invoice from history');
  }
};

export const clearInvoiceHistory = async (): Promise<void> => {
  const res = await fetch('/api/invoices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'clear' }),
  });
  if (!res.ok) {
    throw new Error('Failed to clear invoice history');
  }
};

export const getNextInvoiceNumber = async (): Promise<number> => {
  try {
    const res = await fetch('/api/counter');
    if (!res.ok) return 1;
    const data = await res.json();
    return data.value ?? 1;
  } catch (error) {
    console.error('Error getting invoice number:', error);
    return 1;
  }
};

export const incrementInvoiceNumber = async (): Promise<number> => {
  try {
    const res = await fetch('/api/counter', { method: 'POST' });
    if (!res.ok) return 1;
    const data = await res.json();
    return data.value ?? 1;
  } catch (error) {
    console.error('Error incrementing invoice number:', error);
    return 1;
  }
};

export const setInvoiceNumber = async (number: number): Promise<void> => {
  try {
    await fetch('/api/counter', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: number }),
    });
  } catch (error) {
    console.error('Error setting invoice number:', error);
  }
};

// Migration: move existing localStorage data to MongoDB
export const migrateFromLocalStorage = async (): Promise<void> => {
  try {
    const historyData = localStorage.getItem(STORAGE_KEY);
    const counterData = localStorage.getItem(INVOICE_NUMBER_KEY);

    if (!historyData && !counterData) return;

    const invoices: SavedInvoice[] = historyData ? JSON.parse(historyData) : [];
    const counter = counterData ? parseInt(counterData, 10) : undefined;

    if (invoices.length === 0 && counter === undefined) return;

    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'migrate', invoices, counter }),
    });

    if (res.ok) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(INVOICE_NUMBER_KEY);
      console.log(`Migrated ${invoices.length} invoices to cloud storage`);
    }
  } catch (error) {
    console.error('Migration from localStorage failed:', error);
  }
};
