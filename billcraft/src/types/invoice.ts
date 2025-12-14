export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export interface SellerDetails {
  businessName: string;
  street: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
  email: string;
  abn: string;
  authorizedPerson: string;
}

export interface ClientDetails {
  name: string;
  address: string;
  email: string;
  phone: string;
}

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  bsb: string;
  bankName: string;
  paymentNotes: string;
}

export interface InvoiceHeaderData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  paymentMethod: string;
  isTaxInvoice: boolean;
}

export interface TaxInfo {
  taxName: string;
  taxPercentage: number;
}

export interface SavedInvoice {
  id: string;
  savedAt: string;
  invoiceHeader: InvoiceHeaderData;
  seller: SellerDetails;
  client: ClientDetails;
  items: InvoiceItem[];
  taxInfo: TaxInfo;
  currency: string;
  bankDetails: BankDetails;
  logo: string | null;
}
