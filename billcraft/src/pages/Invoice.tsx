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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PaletteIcon from '@mui/icons-material/Palette';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import html2canvas from 'html2canvas';
import ColorThief from 'colorthief';
import jsPDF from 'jspdf';
import pns from '../assets/pns_logo2.png';
import InvoiceHeader from '../components/invoice/InvoiceHeader';
import InvoiceParties from '../components/invoice/InvoiceParties';
import InvoiceItemsTable from '../components/invoice/InvoiceItemsTable';
import InvoiceSummary from '../components/invoice/InvoiceSummary';
import PaymentInfo from '../components/invoice/PaymentInfo';
import InvoiceFooter from '../components/invoice/InvoiceFooter';
import { saveInvoiceToHistory, getInvoiceHistory, deleteInvoiceFromHistory, getNextInvoiceNumber, incrementInvoiceNumber } from '../utils/localStorage';
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
  // Theme and responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Ref for PDF generation
  const invoiceRef = useRef<HTMLDivElement>(null);

  // PDF generation state
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // History dialog state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<SavedInvoice[]>([]);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  // Logo
  const [logo, setLogo] = useState<string | null>(pns);

  // Primary color for invoice
  const [primaryColor, setPrimaryColor] = useState<string>('#1976d2');
  const colorOptions = [
    '#1976d2', // Blue
    '#2e7d32', // Green
    '#9c27b0', // Purple
    '#d32f2f', // Red
    '#ed6c02', // Orange
    '#0288d1', // Light Blue
    '#7b1fa2', // Deep Purple
    '#c2185b', // Pink
    '#00796b', // Teal
    '#5d4037', // Brown
  ];

  // Invoice Header
  const [invoiceHeaderData, setInvoiceHeaderData] = useState<InvoiceHeaderData>(() => {
    const nextNumber = getNextInvoiceNumber();
    return {
      invoiceNumber: nextNumber.toString().padStart(3, '0'),
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer',
      isTaxInvoice: true,
    };
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

  // Extract dominant color from image
  const extractDominantColor = async (imageDataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const dominantColor = colorThief.getColor(img);
          // Convert RGB to Hex
          const hex = '#' + dominantColor.map((c: number) => c.toString(16).padStart(2, '0')).join('');
          resolve(hex);
        } catch (error) {
          console.error('Error extracting color:', error);
          reject(error);
        }
      };
      img.onerror = reject;
      img.src = imageDataUrl;
    });
  };

  // Handle logo upload
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageDataUrl = reader.result as string;
        setLogo(imageDataUrl);
        
        // Auto-extract and apply dominant color
        try {
          const dominantColor = await extractDominantColor(imageDataUrl);
          setPrimaryColor(dominantColor);
          setSnackbar({ open: true, message: 'Logo uploaded & color matched!', severity: 'success' });
        } catch (error) {
          console.error('Could not extract color from image:', error);
        }
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
      
      // Increment and set next invoice number for new invoices
      const nextNumber = incrementInvoiceNumber();
      setInvoiceHeaderData(prev => ({
        ...prev,
        invoiceNumber: nextNumber.toString().padStart(3, '0'),
      }));
      
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
    setIsHistoryOpen(false);
    setSnackbar({ open: true, message: 'Invoice loaded successfully!', severity: 'success' });
  };

  // Handle delete from history
  const handleDeleteInvoice = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      deleteInvoiceFromHistory(id);
      loadHistory();
      setSnackbar({ open: true, message: 'Invoice deleted', severity: 'success' });
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  // Load history
  const loadHistory = () => {
    const invoices = getInvoiceHistory();
    setHistory(invoices);
  };

  // Handle open history
  const handleOpenHistory = () => {
    loadHistory();
    setIsHistoryOpen(true);
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh',
      pb: 4,
    }}>
      {/* Top Toolbar */}
      <Paper 
        elevation={0}
        sx={{ 
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: { xs: 2, sm: 3, md: 4 },
          py: 2,
        }}
        className="no-print"
      >
        <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems={{ xs: 'stretch', sm: 'center' }}
            spacing={2}
          >
            {/* Left side - Logo upload */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  borderColor: 'grey.300',
                  color: 'grey.700',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.50',
                  },
                }}
              >
                {logo ? 'Change Logo' : 'Upload Logo'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </Button>
              {logo && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar 
                    src={logo} 
                    variant="rounded" 
                    sx={{ width: 36, height: 36, border: '1px solid', borderColor: 'grey.200' }} 
                  />
                  <IconButton 
                    size="small" 
                    onClick={() => setLogo(null)}
                    sx={{ color: 'grey.500' }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>
              )}

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              {/* Color Picker */}
              <Tooltip title="Invoice Color (auto-detected from logo)">
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <PaletteIcon sx={{ color: 'grey.500', fontSize: 20 }} />
                    {logo && (
                      <Tooltip title="Color auto-matched from logo">
                        <AutoFixHighIcon sx={{ color: primaryColor, fontSize: 16 }} />
                      </Tooltip>
                    )}
                  </Stack>
                  {colorOptions.slice(0, isMobile ? 5 : 10).map((color) => (
                    <Box
                      key={color}
                      onClick={() => setPrimaryColor(color)}
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: color,
                        cursor: 'pointer',
                        border: primaryColor === color ? '2px solid' : '2px solid transparent',
                        borderColor: primaryColor === color ? 'grey.800' : 'transparent',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          transform: 'scale(1.2)',
                        },
                      }}
                    />
                  ))}
                  {/* Show extracted color if different from presets */}
                  {!colorOptions.includes(primaryColor) && (
                    <Tooltip title="Extracted from logo">
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: primaryColor,
                          border: '2px solid',
                          borderColor: 'grey.800',
                          position: 'relative',
                          '&::after': {
                            content: '"✓"',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: 10,
                            color: 'white',
                            textShadow: '0 0 2px rgba(0,0,0,0.5)',
                          },
                        }}
                      />
                    </Tooltip>
                  )}
                </Stack>
              </Tooltip>
            </Stack>

            {/* Right side - Actions */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Tooltip title="View History">
                <Button
                  variant="outlined"
                  onClick={handleOpenHistory}
                  startIcon={<HistoryIcon />}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    borderColor: 'grey.300',
                    color: 'grey.700',
                    minWidth: 'auto',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      backgroundColor: 'secondary.50',
                    },
                  }}
                >
                  {!isMobile && 'History'}
                </Button>
              </Tooltip>
              
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              
              <Tooltip title="Save Draft">
                <IconButton 
                  onClick={handleSaveDraft}
                  sx={{ 
                    color: 'grey.600',
                    '&:hover': { backgroundColor: 'grey.100' },
                  }}
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Print">
                <IconButton 
                  onClick={handlePrint}
                  sx={{ 
                    color: 'grey.600',
                    '&:hover': { backgroundColor: 'grey.100' },
                  }}
                >
                  <PrintIcon />
                </IconButton>
              </Tooltip>
              
              <Button
                variant="contained"
                onClick={handleDownloadPDF}
                startIcon={<DownloadIcon />}
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2.5,
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.25)',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.35)',
                  },
                }}
              >
                Download PDF
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      {/* Main Content Area */}
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 3, md: 4 } }}>
        <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
          {/* Invoice Document */}
          <Paper 
            ref={invoiceRef} 
            elevation={0}
            sx={{ 
              p: { xs: 3, sm: 4, md: 5, lg: 6 }, 
              backgroundColor: '#ffffff',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'grey.200',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}
          >
            <InvoiceHeader 
              data={invoiceHeaderData}
              logo={logo}
              isGeneratingPDF={isGeneratingPDF}
              onUpdate={handleInvoiceHeaderUpdate}
              primaryColor={primaryColor}
            />

            <Divider sx={{ my: { xs: 3, md: 4 }, borderColor: 'grey.200' }} />

            <InvoiceParties 
              seller={sellerDetails}
              client={clientDetails}
              isGeneratingPDF={isGeneratingPDF}
              onClientUpdate={handleClientUpdate}
            />

            <Divider sx={{ my: { xs: 3, md: 4 }, borderColor: 'grey.200' }} />

            <InvoiceItemsTable 
              items={items}
              isGeneratingPDF={isGeneratingPDF}
              onItemChange={handleItemChange}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              calculateItemAmount={calculateItemAmount}
              primaryColor={primaryColor}
            />

            <Divider sx={{ my: { xs: 3, md: 4 }, borderColor: 'grey.200' }} />

            <InvoiceSummary 
              subtotal={calculateSubtotal()}
              taxInfo={taxInfo}
              total={calculateTotal()}
              currency={currency}
              isGeneratingPDF={isGeneratingPDF}
              onCurrencyChange={setCurrency}
              primaryColor={primaryColor}
            />

            <Divider sx={{ my: { xs: 3, md: 4 }, borderColor: 'grey.200' }} />

            <PaymentInfo bankDetails={bankDetails} />

            <Divider sx={{ my: { xs: 3, md: 4 }, borderColor: 'grey.200' }} />

            <InvoiceFooter 
              thankYouMessage={thankYouMessage}
              businessName={sellerDetails.businessName}
              phone={sellerDetails.phone}
              email={sellerDetails.email}
              authorizedPerson={sellerDetails.authorizedPerson}
              primaryColor={primaryColor}
            />
          </Paper>
        </Box>
      </Box>

      {/* History Dialog */}
      <Dialog
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '80vh',
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <HistoryIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Saved Invoices
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                backgroundColor: 'grey.100', 
                px: 1.5, 
                py: 0.5, 
                borderRadius: 2,
                fontWeight: 600,
                color: 'grey.600',
              }}
            >
              {history.length} / 20
            </Typography>
          </Stack>
          <IconButton onClick={() => setIsHistoryOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 1 }}>
          {history.length === 0 ? (
            <Box sx={{ 
              py: 6, 
              textAlign: 'center',
            }}>
              <DescriptionOutlinedIcon sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
              <Typography color="text.secondary" fontWeight={500}>
                No saved invoices yet
              </Typography>
              <Typography variant="body2" color="text.disabled" mt={0.5}>
                Click "Save" to save your first invoice
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5} sx={{ py: 1 }}>
              {history.map((invoice) => (
                <Paper
                  key={invoice.id}
                  elevation={0}
                  onClick={() => handleLoadInvoice(invoice)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'grey.200',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'primary.50',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box sx={{ 
                        width: 44, 
                        height: 44, 
                        borderRadius: 2,
                        backgroundColor: 'primary.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Typography variant="body2" fontWeight={700} color="primary.main">
                          #{invoice.invoiceHeader.invoiceNumber}
                        </Typography>
                      </Box>
                      <Stack spacing={0.25}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {invoice.client.name || 'No client name'}
                        </Typography>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(invoice.savedAt)}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">•</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                    
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={(e) => handleDeleteInvoice(invoice.id, e)}
                        sx={{
                          color: 'grey.400',
                          '&:hover': {
                            color: 'error.main',
                            backgroundColor: 'error.50',
                          },
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ 
            borderRadius: 2,
            fontWeight: 500,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Invoice;
