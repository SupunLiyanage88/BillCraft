import { Stack, Box, Typography, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { TaxInfo } from '../../types/invoice';

interface InvoiceSummaryProps {
  subtotal: number;
  taxInfo: TaxInfo;
  total: number;
  currency: string;
  isGeneratingPDF: boolean;
  onCurrencyChange: (currency: string) => void;
}

function InvoiceSummary({ 
  subtotal, 
  taxInfo, 
  total, 
  currency, 
  isGeneratingPDF, 
  onCurrencyChange 
}: InvoiceSummaryProps) {
  const taxAmount = (subtotal * taxInfo.taxPercentage) / 100;

  return (
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
            <Typography variant="body1" fontWeight="600">${subtotal.toFixed(2)}</Typography>
          </Stack>
          
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1" color="text.secondary">{taxInfo.taxName} ({taxInfo.taxPercentage}%):</Typography>
            <Typography variant="body1" fontWeight="600">${taxAmount.toFixed(2)}</Typography>
          </Stack>
          
          <Divider sx={{ borderColor: '#d0d0d0' }} />
          
          <Stack direction="row" justifyContent="space-between" sx={{ paddingY: 1, backgroundColor: 'primary.main', paddingX: 2, borderRadius: 1 }}>
            <Typography variant="h6" fontWeight="700" color="white">
              TOTAL ({currency})
            </Typography>
            <Typography variant="h6" fontWeight="700" color="white">
              ${total.toFixed(2)}
            </Typography>
          </Stack>

          {!isGeneratingPDF && (
            <FormControl fullWidth size="small" sx={{ marginTop: 1 }}>
              <InputLabel>Currency</InputLabel>
              <Select
                value={currency}
                label="Currency"
                onChange={(e) => onCurrencyChange(e.target.value)}
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
  );
}

export default InvoiceSummary;
