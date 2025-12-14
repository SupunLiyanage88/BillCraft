import { Box, Stack, Typography, TextField, Chip, Avatar } from '@mui/material';
import type { InvoiceHeaderData } from '../../types/invoice';

interface InvoiceHeaderProps {
  data: InvoiceHeaderData;
  logo: string | null;
  isGeneratingPDF: boolean;
  onUpdate: (field: keyof InvoiceHeaderData, value: string | boolean) => void;
  primaryColor?: string;
}

function InvoiceHeader({ data, logo, isGeneratingPDF, onUpdate, primaryColor = '#1976d2' }: InvoiceHeaderProps) {
  return (
    <Box sx={{ marginBottom: { xs: 2, md: 4 } }}>
      <Stack 
        direction={isGeneratingPDF ? 'row' : { xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={isGeneratingPDF ? 'flex-start' : { xs: 'center', sm: 'flex-start' }} 
        flexWrap="nowrap" 
        gap={2}
      >
        <Box sx={{ textAlign: isGeneratingPDF ? 'left' : { xs: 'center', sm: 'left' }, flex: 1 }}>
          <Typography variant="h3" fontWeight="700" sx={{ letterSpacing: 1, fontSize: isGeneratingPDF ? '3rem' : { xs: '2rem', sm: '2.5rem', md: '3rem' }, color: primaryColor }}>
            INVOICE
          </Typography>
          {data.isTaxInvoice && (
            <Chip 
              label="TAX INVOICE" 
              size="small"
              sx={{ marginTop: 1, fontWeight: 600, backgroundColor: primaryColor, color: 'white' }}
            />
          )}
        </Box>
        <Box sx={{ 
          textAlign: isGeneratingPDF ? 'right' : { xs: 'center', sm: 'right' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: isGeneratingPDF ? 'flex-end' : { xs: 'center', sm: 'flex-end' }
        }}>
          {logo && (
            <Avatar 
              src={logo} 
              variant="square" 
              sx={{ 
                width: isGeneratingPDF ? 100 : { xs: 80, sm: 100, md: 120 }, 
                height: isGeneratingPDF ? 100 : { xs: 80, sm: 100, md: 120 }, 
                objectFit: 'contain',
                marginBottom: 1
              }} 
            />
          )}
          <Typography variant="h6" color="text.secondary" sx={{ fontSize: isGeneratingPDF ? '1.25rem' : { xs: '1rem', sm: '1.25rem' } }}>
            Invoice #{data.invoiceNumber}
          </Typography>
        </Box>
      </Stack>
      
      {isGeneratingPDF ? (
        <Stack spacing={1.5} sx={{ marginTop: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight="600">INVOICE NUMBER</Typography>
            <Typography variant="body1">{data.invoiceNumber}</Typography>
          </Box>
          <Stack direction="row" spacing={4} flexWrap="wrap">
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">ISSUE DATE</Typography>
              <Typography variant="body1">{new Date(data.issueDate).toLocaleDateString('en-GB')}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">DUE DATE</Typography>
              <Typography variant="body1">{new Date(data.dueDate).toLocaleDateString('en-GB')}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">PAYMENT METHOD</Typography>
              <Typography variant="body1">{data.paymentMethod}</Typography>
            </Box>
          </Stack>
        </Stack>
      ) : (
        <Stack spacing={2} sx={{ marginTop: { xs: 2, md: 3 } }}>
          <TextField
            label="Invoice Number"
            value={data.invoiceNumber}
            onChange={(e) => onUpdate('invoiceNumber', e.target.value)}
            size="small"
            fullWidth
            variant="outlined"
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Issue Date"
              type="date"
              value={data.issueDate}
              onChange={(e) => onUpdate('issueDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Due Date"
              type="date"
              value={data.dueDate}
              onChange={(e) => onUpdate('dueDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
              variant="outlined"
            />
          </Stack>
          <TextField
            label="Payment Method"
            value={data.paymentMethod}
            onChange={(e) => onUpdate('paymentMethod', e.target.value)}
            size="small"
            fullWidth
            variant="outlined"
          />
        </Stack>
      )}
    </Box>
  );
}

export default InvoiceHeader;
