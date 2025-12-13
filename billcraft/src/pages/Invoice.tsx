import { useState } from 'react';
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
  Grid,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

function Invoice() {
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

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: '0 auto' }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        {/* 1️⃣ Invoice Header Section */}
        <Box sx={{ marginBottom: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h3" fontWeight="bold">
              INVOICE
            </Typography>
            {isTaxInvoice && (
              <Chip label="TAX INVOICE" color="primary" />
            )}
          </Stack>
          
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Invoice Number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Issue Date"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Payment Method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                size="small"
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ marginY: 3 }} />

        {/* 2️⃣ Seller Details & 3️⃣ Client Details */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              FROM
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {businessName}
            </Typography>
            {street && <Typography variant="body2">{street}</Typography>}
            {city && <Typography variant="body2">{city}, {state} {postcode}</Typography>}
            {country && <Typography variant="body2">{country}</Typography>}
            <Typography variant="body2" sx={{ marginTop: 1 }}>
              Phone: {phone}
            </Typography>
            <Typography variant="body2">
              Email: {email}
            </Typography>
            <Typography variant="body2">
              ABN: {abn}
            </Typography>
            {authorizedPerson && (
              <Typography variant="body2">
                Authorized Person: {authorizedPerson}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              BILL TO
            </Typography>
            <TextField
              fullWidth
              label="Client Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              size="small"
              sx={{ marginBottom: 1 }}
            />
            <TextField
              fullWidth
              label="Client Address (Optional)"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              size="small"
              sx={{ marginBottom: 1 }}
            />
            <TextField
              fullWidth
              label="Client Email (Optional)"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              size="small"
              sx={{ marginBottom: 1 }}
            />
            <TextField
              fullWidth
              label="Client Phone (Optional)"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              size="small"
            />
          </Grid>
        </Grid>

        <Divider sx={{ marginY: 3 }} />

        {/* 4️⃣ Invoice Items Table */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          ITEMS
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell align="right"><strong>Quantity</strong></TableCell>
                <TableCell align="right"><strong>Unit Price</strong></TableCell>
                <TableCell align="right"><strong>Discount</strong></TableCell>
                <TableCell align="right"><strong>Amount</strong></TableCell>
                <TableCell align="center"><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      size="small"
                      placeholder="Item description"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      size="small"
                      sx={{ width: 80 }}
                      inputProps={{ min: 0, step: 1 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      size="small"
                      sx={{ width: 100 }}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      value={item.discount}
                      onChange={(e) => handleItemChange(item.id, 'discount', parseFloat(e.target.value) || 0)}
                      size="small"
                      sx={{ width: 100 }}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      ${calculateItemAmount(item).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={items.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddItem}
          sx={{ marginTop: 2 }}
          variant="outlined"
        >
          Add Item
        </Button>

        <Divider sx={{ marginY: 3 }} />

        {/* 5️⃣ Subtotal & Tax + 6️⃣ Total Section */}
        <Grid container justifyContent="flex-end">
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body1">Subtotal:</Typography>
                  <Typography variant="body1">${calculateSubtotal().toFixed(2)}</Typography>
                </Stack>
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body1">{taxName} ({taxPercentage}%):</Typography>
                  <Typography variant="body1">${calculateTaxAmount().toFixed(2)}</Typography>
                </Stack>
                
                <Divider />
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" fontWeight="bold">
                    TOTAL ({currency}):
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Stack>

                <FormControl fullWidth size="small" sx={{ marginTop: 1 }}>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={currency}
                    label="Currency"
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <MenuItem value="AUD">AUD</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="LKR">LKR</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ marginY: 3 }} />

        {/* 7️⃣ Bank / Payment Details */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          PAYMENT DETAILS
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2"><strong>Account Name:</strong> {accountName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2"><strong>Account Number:</strong> {accountNumber}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2"><strong>BSB:</strong> {bsb}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2"><strong>Bank Name:</strong> {bankName}</Typography>
          </Grid>
          {paymentNotes && (
            <Grid item xs={12}>
              <Typography variant="body2"><strong>Notes:</strong> {paymentNotes}</Typography>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ marginY: 3 }} />

        {/* 8️⃣ Footer Section */}
        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
          <Typography variant="body1" color="primary" fontWeight="bold">
            {thankYouMessage}
          </Typography>
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            {businessName} | {phone} | {email}
          </Typography>
          {authorizedPerson && (
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              Authorized Signature: {authorizedPerson}
            </Typography>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ marginTop: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" color="primary">
            Download PDF
          </Button>
          <Button variant="outlined" color="secondary">
            Print Invoice
          </Button>
          <Button variant="outlined">
            Save Draft
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Invoice;
