import type { SavedInvoice } from '../types/invoice';

const STORAGE_KEY = 'billcraft_invoice_history';
const MAX_RECORDS = 20;

export const saveInvoiceToHistory = (invoice: SavedInvoice): void => {
  try {
    const history = getInvoiceHistory();
    
    // Add new invoice at the beginning
    history.unshift(invoice);
    
    // Keep only the last 20 records
    const trimmedHistory = history.slice(0, MAX_RECORDS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Error saving invoice to history:', error);
    throw new Error('Failed to save invoice to history');
  }
};

export const getInvoiceHistory = (): SavedInvoice[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading invoice history:', error);
    return [];
  }
};

export const getInvoiceById = (id: string): SavedInvoice | null => {
  try {
    const history = getInvoiceHistory();
    return history.find(invoice => invoice.id === id) || null;
  } catch (error) {
    console.error('Error loading invoice:', error);
    return null;
  }
};

export const deleteInvoiceFromHistory = (id: string): void => {
  try {
    const history = getInvoiceHistory();
    const updatedHistory = history.filter(invoice => invoice.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error deleting invoice from history:', error);
    throw new Error('Failed to delete invoice from history');
  }
};

export const clearInvoiceHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing invoice history:', error);
    throw new Error('Failed to clear invoice history');
  }
};
