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
  SwipeableDrawer,
  Fab,
  Collapse,
  CircularProgress,
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
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
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

  // Mobile UI states
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

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

  // Generate PDF blob (reusable for download and share)
  const generatePDFBlob = async (): Promise<Blob | null> => {
    if (!invoiceRef.current) return null;

    try {
      setIsGeneratingPDF(true);
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200, // Force consistent width across all devices
      });

      // Use JPEG with compression instead of PNG
      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true, // Enable compression
      });

      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      
      // Calculate dimensions to fit on single page
      let imgWidth = pageWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // If content is taller than page, scale down to fit
      if (imgHeight > pageHeight) {
        const scaleFactor = pageHeight / imgHeight;
        imgHeight = pageHeight;
        imgWidth = imgWidth * scaleFactor;
      }
      
      // Center horizontally if scaled down
      const xOffset = (pageWidth - imgWidth) / 2;
      
      pdf.addImage(imgData, 'JPEG', xOffset, 0, imgWidth, imgHeight, undefined, 'FAST');
      
      setIsGeneratingPDF(false);
      return pdf.output('blob');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGeneratingPDF(false);
      return null;
    }
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      setIsGeneratingPDF(true);
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200, // Force consistent width across all devices
      });

      // Use JPEG with compression instead of PNG
      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true, // Enable compression
      });

      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      
      // Calculate dimensions to fit on single page
      let imgWidth = pageWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // If content is taller than page, scale down to fit
      if (imgHeight > pageHeight) {
        const scaleFactor = pageHeight / imgHeight;
        imgHeight = pageHeight;
        imgWidth = imgWidth * scaleFactor;
      }
      
      // Center horizontally if scaled down
      const xOffset = (pageWidth - imgWidth) / 2;
      
      pdf.addImage(imgData, 'JPEG', xOffset, 0, imgWidth, imgHeight, undefined, 'FAST');
      pdf.save(`Invoice-${invoiceHeaderData.invoiceNumber}.pdf`);
      
      // Auto-save invoice to history after download
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
        
        setSnackbar({ open: true, message: 'Invoice downloaded & saved!', severity: 'success' });
      } catch (saveError) {
        console.error('Error auto-saving invoice:', saveError);
        setSnackbar({ open: true, message: 'Invoice downloaded (save failed)', severity: 'success' });
      }
      
      setIsGeneratingPDF(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGeneratingPDF(false);
    }
  };

  // Handle WhatsApp share
  const handleWhatsAppShare = async () => {
    const invoiceNumber = invoiceHeaderData.invoiceNumber;
    const clientName = clientDetails.name || 'Customer';
    const total = calculateTotal().toFixed(2);
    
    // Check if Web Share API is available (mobile devices)
    if (navigator.share && navigator.canShare) {
      try {
        const pdfBlob = await generatePDFBlob();
        if (pdfBlob) {
          const file = new File([pdfBlob], `Invoice-${invoiceNumber}.pdf`, { type: 'application/pdf' });
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `Invoice #${invoiceNumber}`,
              text: `Invoice #${invoiceNumber} for ${clientName} - Total: ${currency} ${total}`,
              files: [file],
            });
            setSnackbar({ open: true, message: 'Shared successfully!', severity: 'success' });
            return;
          }
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    }
    
    // Fallback: Open WhatsApp with a text message
    const message = encodeURIComponent(
      `📄 Invoice #${invoiceNumber}\n` +
      `👤 Client: ${clientName}\n` +
      `💰 Total: ${currency} ${total}\n\n` +
      `Please download the PDF from our system or request it via email.`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
    setSnackbar({ open: true, message: 'Opening WhatsApp...', severity: 'success' });
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

  // Mobile Color Picker Drawer
  const ColorPickerDrawer = () => (
    <SwipeableDrawer
      anchor="bottom"
      open={isColorPickerOpen}
      onClose={() => setIsColorPickerOpen(false)}
      onOpen={() => setIsColorPickerOpen(true)}
      disableSwipeToOpen
      PaperProps={{
        sx: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          px: 3,
          py: 2,
          pb: 4,
        }
      }}
    >
      <Box sx={{ width: 40, height: 4, backgroundColor: 'grey.300', borderRadius: 2, mx: 'auto', mb: 2 }} />
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Choose Invoice Color
      </Typography>
      {logo && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <AutoFixHighIcon sx={{ color: primaryColor, fontSize: 18 }} />
          <Typography variant="body2" color="text.secondary">
            Color auto-detected from logo
          </Typography>
        </Stack>
      )}
      <Stack direction="row" flexWrap="wrap" gap={2} justifyContent="center">
        {colorOptions.map((color) => (
          <Box
            key={color}
            onClick={() => {
              setPrimaryColor(color);
              setIsColorPickerOpen(false);
            }}
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: color,
              cursor: 'pointer',
              border: primaryColor === color ? '3px solid' : '3px solid transparent',
              borderColor: primaryColor === color ? 'grey.800' : 'transparent',
              transition: 'all 0.15s ease',
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
          />
        ))}
        {/* Show extracted color if different from presets */}
        {!colorOptions.includes(primaryColor) && (
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: primaryColor,
              border: '3px solid',
              borderColor: 'grey.800',
              position: 'relative',
              '&::after': {
                content: '"✓"',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: 16,
                color: 'white',
                textShadow: '0 0 2px rgba(0,0,0,0.5)',
              },
            }}
          />
        )}
      </Stack>
    </SwipeableDrawer>
  );

  // History Drawer/Dialog - Swipeable drawer for mobile, Dialog for desktop
  const HistoryContent = () => (
    <>
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
            Tap "Save" to save your first invoice
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
                // Better touch feedback for mobile
                '&:active': {
                  backgroundColor: 'primary.50',
                  transform: 'scale(0.98)',
                },
                '@media (hover: hover)': {
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.50',
                    transform: 'translateX(4px)',
                  },
                },
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 2,
                    backgroundColor: 'primary.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Typography variant="body2" fontWeight={700} color="primary.main">
                      #{invoice.invoiceHeader.invoiceNumber}
                    </Typography>
                  </Box>
                  <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                      {invoice.client.name || 'No client name'}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
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
                
                <IconButton
                  size="medium"
                  onClick={(e) => handleDeleteInvoice(invoice.id, e)}
                  sx={{
                    color: 'grey.400',
                    minWidth: 44,
                    minHeight: 44,
                    '&:hover': {
                      color: 'error.main',
                      backgroundColor: 'error.50',
                    },
                  }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </>
  );

  return (
    <Box sx={{ 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh',
      // Add padding bottom for mobile bottom bar
      pb: { xs: 12, md: 4 },
    }}>
      {/* Top Toolbar - Compact on mobile */}
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
          py: { xs: 1.5, sm: 2 },
        }}
        className="no-print animate-slideDown"
      >
        <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
          {/* Mobile Toolbar */}
          {isMobile ? (
            <Stack spacing={1.5}>
              {/* Primary row - always visible */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  {/* Logo upload button */}
                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      borderColor: 'grey.300',
                      color: 'grey.700',
                      minWidth: 'auto',
                      px: 1.5,
                      minHeight: 40,
                      '&:hover': {
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <CloudUploadIcon fontSize="small" sx={{ mr: logo ? 0 : 0.5 }} />
                    {!logo && <Typography variant="caption">Logo</Typography>}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </Button>
                  {logo && (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Avatar 
                        src={logo} 
                        variant="rounded" 
                        sx={{ width: 32, height: 32, border: '1px solid', borderColor: 'grey.200' }} 
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => setLogo(null)}
                        sx={{ color: 'grey.500', padding: 0.5 }}
                      >
                        <CloseIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Stack>
                  )}
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  {/* Color picker button */}
                  <IconButton
                    onClick={() => setIsColorPickerOpen(true)}
                    sx={{
                      minWidth: 40,
                      minHeight: 40,
                      border: '2px solid',
                      borderColor: primaryColor,
                      backgroundColor: `${primaryColor}15`,
                    }}
                  >
                    <PaletteIcon sx={{ color: primaryColor, fontSize: 20 }} />
                  </IconButton>
                  
                  {/* Expand/collapse more options */}
                  <IconButton
                    onClick={() => setIsToolbarExpanded(!isToolbarExpanded)}
                    sx={{ minWidth: 40, minHeight: 40 }}
                  >
                    {isToolbarExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Stack>
              </Stack>

              {/* Expanded options */}
              <Collapse in={isToolbarExpanded}>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ pt: 1 }}>
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
                      minHeight: 40,
                    }}
                  >
                    History
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleSaveDraft}
                    startIcon={<SaveIcon />}
                    size="small"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      borderColor: 'grey.300',
                      color: 'grey.700',
                      minHeight: 40,
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handlePrint}
                    startIcon={<PrintIcon />}
                    size="small"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      borderColor: 'grey.300',
                      color: 'grey.700',
                      minHeight: 40,
                    }}
                  >
                    Print
                  </Button>
                </Stack>
              </Collapse>
            </Stack>
          ) : (
            /* Desktop Toolbar */
            <Stack 
              direction="row"
              justifyContent="space-between" 
              alignItems="center"
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
                    {colorOptions.map((color) => (
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
                    History
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

                <Tooltip title="Share via WhatsApp">
                  <IconButton 
                    onClick={handleWhatsAppShare}
                    sx={{ 
                      color: '#25D366',
                      '&:hover': { backgroundColor: 'rgba(37, 211, 102, 0.1)' },
                    }}
                  >
                    <WhatsAppIcon />
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
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(25, 118, 210, 0.35)',
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  Download PDF
                </Button>
              </Stack>
            </Stack>
          )}
        </Box>
      </Paper>

      {/* Loading Overlay during PDF generation */}
      {isGeneratingPDF && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <CircularProgress size={48} thickness={4} />
          <Typography variant="h6" fontWeight={600} color="primary">
            Generating Invoice...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we prepare your PDF
          </Typography>
        </Box>
      )}

      {/* Main Content Area */}
      <Box 
        className="animate-fadeIn"
        sx={{ px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 2, md: 4 } }}
      >
        <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
          {/* Invoice Document */}
          <Paper 
            ref={invoiceRef} 
            elevation={0}
            sx={{ 
              p: { xs: 2, sm: 4, md: 5, lg: 6 }, 
              backgroundColor: '#ffffff',
              borderRadius: { xs: 2, md: 3 },
              border: '1px solid',
              borderColor: 'grey.200',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              transition: 'box-shadow 0.3s ease, transform 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              },
              // Force consistent desktop-like layout during PDF generation
              ...(isGeneratingPDF && {
                width: 1100,
                maxWidth: 'none',
                p: 6,
                borderRadius: 0,
              }),
            }}
          >
            <InvoiceHeader 
              data={invoiceHeaderData}
              logo={logo}
              isGeneratingPDF={isGeneratingPDF}
              onUpdate={handleInvoiceHeaderUpdate}
              primaryColor={primaryColor}
            />

            <Divider sx={{ my: { xs: 2.5, md: 4 }, borderColor: 'grey.200' }} />

            <InvoiceParties 
              seller={sellerDetails}
              client={clientDetails}
              isGeneratingPDF={isGeneratingPDF}
              onClientUpdate={handleClientUpdate}
            />

            <Divider sx={{ my: { xs: 2.5, md: 4 }, borderColor: 'grey.200' }} />

            <InvoiceItemsTable 
              items={items}
              isGeneratingPDF={isGeneratingPDF}
              onItemChange={handleItemChange}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              calculateItemAmount={calculateItemAmount}
              primaryColor={primaryColor}
            />

            <Divider sx={{ my: { xs: 2.5, md: 4 }, borderColor: 'grey.200' }} />

            <InvoiceSummary 
              subtotal={calculateSubtotal()}
              taxInfo={taxInfo}
              total={calculateTotal()}
              currency={currency}
              isGeneratingPDF={isGeneratingPDF}
              onCurrencyChange={setCurrency}
              primaryColor={primaryColor}
            />

            <Divider sx={{ my: { xs: 2.5, md: 4 }, borderColor: 'grey.200' }} />

            <PaymentInfo bankDetails={bankDetails} isGeneratingPDF={isGeneratingPDF} />

            <Divider sx={{ my: { xs: 2.5, md: 4 }, borderColor: 'grey.200' }} />

            <InvoiceFooter 
              thankYouMessage={thankYouMessage}
              businessName={sellerDetails.businessName}
              phone={sellerDetails.phone}
              email={sellerDetails.email}
              authorizedPerson={sellerDetails.authorizedPerson}
              primaryColor={primaryColor}
              isGeneratingPDF={isGeneratingPDF}
            />
          </Paper>
        </Box>
      </Box>

      {/* Mobile Bottom Action Bar */}
      {isMobile && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            px: 2,
            py: 1.5,
            pb: 'calc(env(safe-area-inset-bottom, 8px) + 8px)', // Safe area for notched phones
            backgroundColor: 'white',
            borderTop: '1px solid',
            borderColor: 'grey.200',
          }}
          className="no-print animate-slideUp"
        >
          <Stack direction="row" spacing={1.5} justifyContent="space-around" alignItems="center">
            {/* WhatsApp Share */}
            <Stack alignItems="center" spacing={0.5}>
              <IconButton
                onClick={handleWhatsAppShare}
                sx={{
                  backgroundColor: '#25D366',
                  color: 'white',
                  width: 48,
                  height: 48,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: '#20bd5a',
                    transform: 'scale(1.1)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                }}
              >
                <WhatsAppIcon />
              </IconButton>
              <Typography variant="caption" color="text.secondary" fontSize={10}>
                WhatsApp
              </Typography>
            </Stack>

            {/* Download PDF - Primary action */}
            <Stack alignItems="center" spacing={0.5}>
              <Fab
                color="primary"
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                sx={{
                  width: 56,
                  height: 56,
                  boxShadow: '0 4px 14px rgba(25, 118, 210, 0.4)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.5)',
                  },
                }}
              >
                <DownloadIcon />
              </Fab>
              <Typography variant="caption" color="primary" fontWeight={600} fontSize={10}>
                Download
              </Typography>
            </Stack>

            {/* Save Draft */}
            <Stack alignItems="center" spacing={0.5}>
              <IconButton
                onClick={handleSaveDraft}
                sx={{
                  backgroundColor: 'grey.100',
                  color: 'grey.700',
                  width: 48,
                  height: 48,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'grey.200',
                    transform: 'scale(1.1)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                }}
              >
                <SaveIcon />
              </IconButton>
              <Typography variant="caption" color="text.secondary" fontSize={10}>
                Save
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      )}

      {/* Color Picker Drawer for Mobile */}
      <ColorPickerDrawer />

      {/* History - SwipeableDrawer for mobile, Dialog for desktop */}
      {isMobile ? (
        <SwipeableDrawer
          anchor="bottom"
          open={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onOpen={() => {
            loadHistory();
            setIsHistoryOpen(true);
          }}
          disableSwipeToOpen
          PaperProps={{
            sx: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: '85vh',
              pb: 'env(safe-area-inset-bottom, 16px)',
            }
          }}
        >
          <Box sx={{ px: 3, py: 2 }}>
            {/* Drag handle */}
            <Box sx={{ width: 40, height: 4, backgroundColor: 'grey.300', borderRadius: 2, mx: 'auto', mb: 2 }} />
            
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
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
              <IconButton onClick={() => setIsHistoryOpen(false)} sx={{ minWidth: 44, minHeight: 44 }}>
                <CloseIcon />
              </IconButton>
            </Stack>
            
            <Box sx={{ maxHeight: '60vh', overflowY: 'auto', mx: -1, px: 1 }}>
              <HistoryContent />
            </Box>
          </Box>
        </SwipeableDrawer>
      ) : (
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
            <HistoryContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Snackbar for notifications - positioned above bottom bar on mobile */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          // Position above the bottom bar on mobile
          bottom: { xs: 100, md: 24 },
        }}
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
