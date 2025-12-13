import { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Stack,
  Avatar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import pns from '../assets/pns_logo2.png';

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

function Invoice() {
  // Ref for PDF generation
  const invoiceRef = useRef<HTMLDivElement>(null);

  // PDF generation state
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Logo
  const [logo, setLogo] = useState<string | null>(pns);

  // Invoice Header
  const [invoiceNumber, setInvoiceNumber] = useState('023');
  const [issueDate, setIssueDate] = useState('2025-10-15');
  const [dueDate, setDueDate] = useState('2025-10-29');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [isTaxInvoice, setIsTaxInvoice] = useState(true);

  // Seller Details
  const [businessName] = useState('PnS Facility Services');
  const [street] = useState('');
  const [city] = useState('');
  const [state] = useState('');
  const [postcode] = useState('');
  const [country] = useState('');
  const [phone] = useState('0451060272');
  const [email] = useState('pnsfacilityservices@gmail.com');
  const [abn] = useState('72824407732');
  const [authorizedPerson] = useState('Sathya');

  // Client Details
  const [clientName, setClientName] = useState('Mr. Ranasinghe');
  const [clientAddress, setClientAddress] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Invoice Items
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, description: 'Lawn Mowing', quantity: 1, unitPrice: 100.0, discount: 0.0 },
  ]);

  // Tax & Total
  const [taxName] = useState('GST');
  const [taxPercentage] = useState(10);
  const [currency, setCurrency] = useState('AUD');

  // Bank Details
  const [accountName] = useState('PnS Facility Services');
  const [accountNumber] = useState('18578007');
  const [bsb] = useState('067-873');
  const [bankName] = useState('Comm Bank');
  const [paymentNotes] = useState('');

  // Footer
  const [thankYouMessage] = useState('Thank you for your business!');

  // Calculate amounts
  const calculateItemAmount = (item: InvoiceItem) => {
    return item.quantity * item.unitPrice - item.discount;
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + calculateItemAmount(item), 0);
  };

  const calculateTaxAmount = () => {
    return (calculateSubtotal() * taxPercentage) / 100;
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
      pdf.save(`Invoice-${invoiceNumber}.pdf`);
      
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
        {/* 1️⃣ Invoice Header Section */}
        <Box sx={{ marginBottom: { xs: 2, md: 4 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'center', sm: 'flex-start' }} flexWrap="wrap" gap={2}>
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h3" fontWeight="700" color="primary.main" sx={{ letterSpacing: 1, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                INVOICE
              </Typography>
              {isTaxInvoice && (
                <Chip 
                  label="TAX INVOICE" 
                  color="primary" 
                  size="small"
                  sx={{ marginTop: 1, fontWeight: 600 }}
                />
              )}
            </Box>
            <Box sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
              <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Invoice #{invoiceNumber}
              </Typography>
              {logo && (
                <Avatar 
                  src={logo} 
                  variant="square" 
                  sx={{ width: { xs: 80, sm: 100, md: 120 }, height: { xs: 80, sm: 100, md: 120 }, marginTop: 2, marginLeft: 'auto', objectFit: 'contain' }} 
                />
              )}
            </Box>
          </Stack>
          
          {isGeneratingPDF ? (
            <Stack spacing={1.5} sx={{ marginTop: 3 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">INVOICE NUMBER</Typography>
                <Typography variant="body1">{invoiceNumber}</Typography>
              </Box>
              <Stack direction="row" spacing={4}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">ISSUE DATE</Typography>
                  <Typography variant="body1">{new Date(issueDate).toLocaleDateString('en-GB')}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">DUE DATE</Typography>
                  <Typography variant="body1">{new Date(dueDate).toLocaleDateString('en-GB')}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">PAYMENT METHOD</Typography>
                  <Typography variant="body1">{paymentMethod}</Typography>
                </Box>
              </Stack>
            </Stack>
          ) : (
            <Stack spacing={2} sx={{ marginTop: { xs: 2, md: 3 } }}>
              <TextField
                label="Invoice Number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                size="small"
                fullWidth
                variant="outlined"
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Issue Date"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Due Date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                  variant="outlined"
                />
              </Stack>
              <TextField
                label="Payment Method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                size="small"
                fullWidth
                variant="outlined"
              />
            </Stack>
          )}
        </Box>

        <Divider sx={{ marginY: { xs: 2, md: 4 }, borderColor: '#e0e0e0' }} />

        {/* 2️⃣ Seller Details & 3️⃣ Client Details */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 4 }}>
          <Box sx={{ flex: 1, padding: { xs: 1.5, sm: 2 }, backgroundColor: '#f8f9fc', borderRadius: 2 }}>
            <Typography variant="overline" fontWeight="700" color="primary.main" gutterBottom>
              FROM
            </Typography>
            <Typography variant="h6" fontWeight="700" gutterBottom>
              {businessName}
            </Typography>
            {street && <Typography variant="body2" color="text.secondary">{street}</Typography>}
            {city && <Typography variant="body2" color="text.secondary">{city}, {state} {postcode}</Typography>}
            {country && <Typography variant="body2" color="text.secondary">{country}</Typography>}
            <Divider sx={{ marginY: 1.5, borderColor: '#e0e0e0' }} />
            <Typography variant="body2" color="text.secondary">
              <strong>Phone:</strong> {phone}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Email:</strong> {email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>ABN:</strong> {abn}
            </Typography>
            {authorizedPerson && (
              <Typography variant="body2" color="text.secondary">
                <strong>Authorized Person:</strong> {authorizedPerson}
              </Typography>
            )}
          </Box>

          <Box sx={{ flex: 1, padding: { xs: 1.5, sm: 2 }, backgroundColor: '#f8f9fc', borderRadius: 2 }}>
            <Typography variant="overline" fontWeight="700" color="primary.main" gutterBottom>
              BILL TO
            </Typography>
            {isGeneratingPDF ? (
              <Stack spacing={0.5}>
                <Typography variant="h6" fontWeight="700">{clientName}</Typography>
                {clientAddress && <Typography variant="body2" color="text.secondary">{clientAddress}</Typography>}
                {clientEmail && <Typography variant="body2" color="text.secondary">{clientEmail}</Typography>}
                {clientPhone && <Typography variant="body2" color="text.secondary">{clientPhone}</Typography>}
              </Stack>
            ) : (
              <Stack spacing={1.5}>
                <TextField
                  fullWidth
                  label="Client Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  size="small"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Client Address (Optional)"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  size="small"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Client Email (Optional)"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  size="small"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Client Phone (Optional)"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            )}
          </Box>
        </Stack>

        <Divider sx={{ marginY: 4, borderColor: '#e0e0e0' }} />

        {/* 4️⃣ Invoice Items Table */}
        <Typography variant="h6" fontWeight="700" gutterBottom color="text.primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Items & Services
        </Typography>
        <TableContainer sx={{ marginTop: 2, border: '1px solid #e0e0e0', borderRadius: 1, overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, padding: { xs: '8px 4px', sm: '16px' } }}>Description</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, padding: { xs: '8px 4px', sm: '16px' } }}>Qty</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, padding: { xs: '8px 4px', sm: '16px' } }}>Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, padding: { xs: '8px 4px', sm: '16px' } }}>Disc.</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, padding: { xs: '8px 4px', sm: '16px' } }}>Amount</TableCell>
                {!isGeneratingPDF && (
                  <TableCell align="center" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, padding: { xs: '8px 4px', sm: '16px' } }}>Action</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell sx={{ padding: { xs: '8px 4px', sm: '16px' } }}>
                    {isGeneratingPDF ? (
                      <Typography variant="body2">{item.description}</Typography>
                    ) : (
                      <TextField
                        fullWidth
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        size="small"
                        placeholder="Item description"
                      />
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ padding: { xs: '8px 4px', sm: '16px' } }}>
                    {isGeneratingPDF ? (
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{item.quantity}</Typography>
                    ) : (
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        size="small"
                        sx={{ width: { xs: 60, sm: 80 } }}
                        inputProps={{ min: 0, step: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ padding: { xs: '8px 4px', sm: '16px' } }}>
                    {isGeneratingPDF ? (
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>${item.unitPrice.toFixed(2)}</Typography>
                    ) : (
                      <TextField
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        size="small"
                        sx={{ width: { xs: 70, sm: 100 } }}
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ padding: { xs: '8px 4px', sm: '16px' } }}>
                    {isGeneratingPDF ? (
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>${item.discount.toFixed(2)}</Typography>
                    ) : (
                      <TextField
                        type="number"
                        value={item.discount}
                        onChange={(e) => handleItemChange(item.id, 'discount', parseFloat(e.target.value) || 0)}
                        size="small"
                        sx={{ width: { xs: 70, sm: 100 } }}
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ padding: { xs: '8px 4px', sm: '16px' } }}>
                    <Typography variant="body2" fontWeight="600" color="primary.main" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      ${calculateItemAmount(item).toFixed(2)}
                    </Typography>
                  </TableCell>
                  {!isGeneratingPDF && (
                    <TableCell align="center" sx={{ padding: { xs: '8px 4px', sm: '16px' } }}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {!isGeneratingPDF && (
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            sx={{ marginTop: 2, width: { xs: '100%', sm: 'auto' } }}
            variant="outlined"
            color="primary"
          >
            Add Item
          </Button>
        )}

        <Divider sx={{ marginY: 4, borderColor: '#e0e0e0' }} />

        {/* 5️⃣ Subtotal & Tax + 6️⃣ Total Section */}
        <Stack direction="row" justifyContent="flex-end">
          <Box sx={{ 
            padding: { xs: 2, sm: 3 }, 
            backgroundColor: '#f8f9fc', 
            borderRadius: 2, 
            width: { xs: '100%', sm: '70%', md: '50%', lg: '40%' },
            border: '2px solid #e0e0e0'
          }}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1" color="text.secondary">Subtotal:</Typography>
                <Typography variant="body1" fontWeight="600">${calculateSubtotal().toFixed(2)}</Typography>
              </Stack>
              
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1" color="text.secondary">{taxName} ({taxPercentage}%):</Typography>
                <Typography variant="body1" fontWeight="600">${calculateTaxAmount().toFixed(2)}</Typography>
              </Stack>
              
              <Divider sx={{ borderColor: '#d0d0d0' }} />
              
              <Stack direction="row" justifyContent="space-between" sx={{ paddingY: 1, backgroundColor: 'primary.main', paddingX: 2, borderRadius: 1 }}>
                <Typography variant="h6" fontWeight="700" color="white">
                  TOTAL ({currency})
                </Typography>
                <Typography variant="h6" fontWeight="700" color="white">
                  ${calculateTotal().toFixed(2)}
                </Typography>
              </Stack>

              {!isGeneratingPDF && (
                <FormControl fullWidth size="small" sx={{ marginTop: 1 }}>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={currency}
                    label="Currency"
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <MenuItem value="AUD">AUD - Australian Dollar</MenuItem>
                    <MenuItem value="USD">USD - US Dollar</MenuItem>
                    <MenuItem value="LKR">LKR - Sri Lankan Rupee</MenuItem>
                    <MenuItem value="EUR">EUR - Euro</MenuItem>
                    <MenuItem value="GBP">GBP - British Pound</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ marginY: 4, borderColor: '#e0e0e0' }} />

        {/* 7️⃣ Bank / Payment Details */}
        <Box sx={{ padding: { xs: 2, sm: 3 }, backgroundColor: '#f8f9fc', borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Typography variant="h6" fontWeight="700" gutterBottom color="text.primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Payment Information
          </Typography>
          <Stack spacing={2} sx={{ marginTop: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="600">ACCOUNT NAME</Typography>
                <Typography variant="body1">{accountName}</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="600">ACCOUNT NUMBER</Typography>
                <Typography variant="body1">{accountNumber}</Typography>
              </Box>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="600">BSB</Typography>
                <Typography variant="body1">{bsb}</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="600">BANK NAME</Typography>
                <Typography variant="body1">{bankName}</Typography>
              </Box>
            </Stack>
            {paymentNotes && (
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">NOTES</Typography>
                <Typography variant="body2">{paymentNotes}</Typography>
              </Box>
            )}
          </Stack>
        </Box>

        <Divider sx={{ marginY: 4, borderColor: '#e0e0e0' }} />

        {/* 8️⃣ Footer Section */}
        <Box sx={{ textAlign: 'center', marginTop: { xs: 2, md: 4 }, paddingY: { xs: 2, sm: 3 }, backgroundColor: '#f8f9fc', borderRadius: 2 }}>
          <Typography variant="h6" color="primary" fontWeight="700" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            {thankYouMessage}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            {businessName} • {phone} • {email}
          </Typography>
          {authorizedPerson && (
            <Box sx={{ marginTop: 3, paddingTop: 2, borderTop: '1px dashed #d0d0d0' }}>
              <Typography variant="caption" color="text.secondary" display="block">
                AUTHORIZED SIGNATURE
              </Typography>
              <Typography variant="body1" fontWeight="600" sx={{ marginTop: 1 }}>
                {authorizedPerson}
              </Typography>
            </Box>
          )}
        </Box>
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
          >
            Save Draft
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Invoice;
