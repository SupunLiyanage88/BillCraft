import { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Divider,
  Button,
  Stack,
  Avatar,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import HistoryIcon from '@mui/icons-material/History';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import pns from '../assets/pns_logo2.png';
import InvoiceHeader from '../components/invoice/InvoiceHeader';
import InvoiceParties from '../components/invoice/InvoiceParties';
import InvoiceItemsTable from '../components/invoice/InvoiceItemsTable';
import InvoiceSummary from '../components/invoice/InvoiceSummary';
import PaymentInfo from '../components/invoice/PaymentInfo';
import InvoiceFooter from '../components/invoice/InvoiceFooter';
import InvoiceHistory from '../components/invoice/InvoiceHistory';
import { saveInvoiceToHistory } from '../utils/localStorage';
import type { 
  InvoiceItem, 
  InvoiceHeaderData, 
  SellerDetails, 
  ClientDetails, 
  BankDetails,
  TaxInfo,
  SavedInvoice 
} from '../types/invoice';

function Invoice() {
  // Ref for PDF generation
  const invoiceRef = useRef<HTMLDivElement>(null);

  // PDF generation state
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // History dialog state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  // Logo
  const [logo, setLogo] = useState<string | null>(pns);

  // Invoice Header
  const [invoiceHeaderData, setInvoiceHeaderData] = useState<InvoiceHeaderData>({
    invoiceNumber: '023',
    issueDate: '2025-10-15',
    dueDate: '2025-10-29',
    paymentMethod: 'Bank Transfer',
    isTaxInvoice: true,
  });

  // Seller Details
  const sellerDetails: SellerDetails = {
    businessName: 'PnS Facility Services',
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    phone: '0451060272',
    email: 'pnsfacilityservices@gmail.com',
    abn: '72824407732',
    authorizedPerson: 'Sathya',
  };

  // Client Details
  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    name: 'Mr. Ranasinghe',
    address: '',
    email: '',
    phone: '',
  });

  // Invoice Items
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, description: 'Lawn Mowing', quantity: 1, unitPrice: 100.0, discount: 0.0 },
  ]);

  // Tax & Total
  const taxInfo: TaxInfo = {
    taxName: 'GST',
    taxPercentage: 10,
  };
  const [currency, setCurrency] = useState('AUD');

  // Bank Details
  const bankDetails: BankDetails = {
    accountName: 'PnS Facility Services',
    accountNumber: '18578007',
    bsb: '067-873',
    bankName: 'Comm Bank',
    paymentNotes: '',
  };

  // Footer
  const thankYouMessage = 'Thank you for your business!';

  // Calculate amounts
  const calculateItemAmount = (item: InvoiceItem) => {
    return item.quantity * item.unitPrice - item.discount;
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + calculateItemAmount(item), 0);
  };

  const calculateTaxAmount = () => {
    return (calculateSubtotal() * taxInfo.taxPercentage) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxAmount();
  };

  // Handle item changes
  const handleAddItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems([...items, { id: newId, description: '', quantity: 1, unitPrice: 0, discount: 0 }]);
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleInvoiceHeaderUpdate = (field: keyof InvoiceHeaderData, value: string | boolean) => {
    setInvoiceHeaderData(prev => ({ ...prev, [field]: value }));
  };

  const handleClientUpdate = (field: keyof ClientDetails, value: string) => {
    setClientDetails(prev => ({ ...prev, [field]: value }));
  };

  // Handle logo upload
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      // Set generating state to hide input fields
      setIsGeneratingPDF(true);
      
      // Wait for state update to render
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Invoice-${invoiceHeaderData.invoiceNumber}.pdf`);
      
      // Reset generating state
      setIsGeneratingPDF(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGeneratingPDF(false);
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle save to history
  const handleSaveDraft = () => {
    try {
      const savedInvoice: SavedInvoice = {
        id: `${Date.now()}-${invoiceHeaderData.invoiceNumber}`,
        savedAt: new Date().toISOString(),
        invoiceHeader: invoiceHeaderData,
        seller: sellerDetails,
        client: clientDetails,
        items: items,
        taxInfo: taxInfo,
        currency: currency,
        bankDetails: bankDetails,
        logo: logo,
      };
      
      saveInvoiceToHistory(savedInvoice);
      setSnackbar({ open: true, message: 'Invoice saved successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error saving invoice:', error);
      setSnackbar({ open: true, message: 'Failed to save invoice', severity: 'error' });
    }
  };

  // Handle load from history
  const handleLoadInvoice = (invoice: SavedInvoice) => {
    setInvoiceHeaderData(invoice.invoiceHeader);
    setClientDetails(invoice.client);
    setItems(invoice.items);
    setCurrency(invoice.currency);
    setLogo(invoice.logo);
    setSnackbar({ open: true, message: 'Invoice loaded successfully!', severity: 'success' });
  };

  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ padding: { xs: 1, sm: 2, md: 4 }, maxWidth: 1200, margin: '0 auto', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Logo Upload Controls */}
      <Paper elevation={2} sx={{ padding: { xs: 1.5, sm: 2 }, marginBottom: { xs: 2, md: 3 }, backgroundColor: '#fff' }} className="no-print">
        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            size="small"
            fullWidth={false}
            sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
          >
            Upload Logo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleLogoUpload}
            />
          </Button>
          {logo && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar src={logo} variant="square" sx={{ width: 40, height: 40 }} />
              <Typography variant="caption" color="text.secondary">Logo uploaded</Typography>
            </Stack>
          )}
        </Stack>
      </Paper>

      {/* Invoice Document */}
      <Paper ref={invoiceRef} elevation={4} sx={{ padding: { xs: 2, sm: 3, md: 5 }, backgroundColor: '#ffffff' }}>
        <InvoiceHeader 
          data={invoiceHeaderData}
          logo={logo}
          isGeneratingPDF={isGeneratingPDF}
          onUpdate={handleInvoiceHeaderUpdate}
        />

        <Divider sx={{ marginY: { xs: 2, md: 4 }, borderColor: '#e0e0e0' }} />

        <InvoiceParties 
          seller={sellerDetails}
          client={clientDetails}
          isGeneratingPDF={isGeneratingPDF}
          onClientUpdate={handleClientUpdate}
        />

        <Divider sx={{ marginY: 4, borderColor: '#e0e0e0' }} />

        <InvoiceItemsTable 
          items={items}
          isGeneratingPDF={isGeneratingPDF}
          onItemChange={handleItemChange}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          calculateItemAmount={calculateItemAmount}
        />

        <Divider sx={{ marginY: 4, borderColor: '#e0e0e0' }} />

        <InvoiceSummary 
          subtotal={calculateSubtotal()}
          taxInfo={taxInfo}
          total={calculateTotal()}
          currency={currency}
          isGeneratingPDF={isGeneratingPDF}
          onCurrencyChange={setCurrency}
        />

        <Divider sx={{ marginY: 4, borderColor: '#e0e0e0' }} />

        <PaymentInfo bankDetails={bankDetails} />

        <Divider sx={{ marginY: 4, borderColor: '#e0e0e0' }} />

        <InvoiceFooter 
          thankYouMessage={thankYouMessage}
          businessName={sellerDetails.businessName}
          phone={sellerDetails.phone}
          email={sellerDetails.email}
          authorizedPerson={sellerDetails.authorizedPerson}
        />
      </Paper>

      {/* Action Buttons */}
      <Paper elevation={2} sx={{ marginTop: { xs: 2, md: 3 }, padding: { xs: 1.5, sm: 2 }, backgroundColor: '#fff' }} className="no-print">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<DownloadIcon />}
            size="large"
            fullWidth
            sx={{ paddingX: 4, paddingY: { xs: 1.5, sm: 1 }, minHeight: 48 }}
            onClick={handleDownloadPDF}
          >
            Download PDF
          </Button>
          <Button 
            variant="outlined" 
            color="primary"
            startIcon={<PrintIcon />}
            size="large"
            fullWidth
            sx={{ paddingX: 4, paddingY: { xs: 1.5, sm: 1 }, minHeight: 48 }}
            onClick={handlePrint}
          >
            Print Invoice
          </Button>
          <Button 
            variant="outlined"
            startIcon={<SaveIcon />}
            size="large"
            fullWidth
            sx={{ paddingX: 4, paddingY: { xs: 1.5, sm: 1 }, minHeight: 48 }}
            onClick={handleSaveDraft}
          >
            Save Draft
          </Button>
          <Button 
            variant="outlined"
            color="secondary"
            startIcon={<HistoryIcon />}
            size="large"
            fullWidth
            sx={{ paddingX: 4, paddingY: { xs: 1.5, sm: 1 }, minHeight: 48 }}
            onClick={() => setIsHistoryOpen(true)}
          >
            History
          </Button>
        </Stack>
      </Paper>

      {/* Invoice History Dialog */}
      <InvoiceHistory
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onLoadInvoice={handleLoadInvoice}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Invoice;
