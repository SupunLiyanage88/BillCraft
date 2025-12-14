import { Box, Typography, Stack } from '@mui/material';
import type { BankDetails } from '../../types/invoice';

interface PaymentInfoProps {
  bankDetails: BankDetails;
}

function PaymentInfo({ bankDetails }: PaymentInfoProps) {
  return (
    <Box sx={{ padding: { xs: 2, sm: 3 }, backgroundColor: '#f8f9fc', borderRadius: 2, border: '1px solid #e0e0e0' }}>
      <Typography variant="h6" fontWeight="700" gutterBottom color="text.primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        Payment Information
      </Typography>
      <Stack spacing={2} sx={{ marginTop: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="600">ACCOUNT NAME</Typography>
            <Typography variant="body1">{bankDetails.accountName}</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="600">ACCOUNT NUMBER</Typography>
            <Typography variant="body1">{bankDetails.accountNumber}</Typography>
          </Box>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="600">BSB</Typography>
            <Typography variant="body1">{bankDetails.bsb}</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="600">BANK NAME</Typography>
            <Typography variant="body1">{bankDetails.bankName}</Typography>
          </Box>
        </Stack>
        {bankDetails.paymentNotes && (
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight="600">NOTES</Typography>
            <Typography variant="body2">{bankDetails.paymentNotes}</Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

export default PaymentInfo;
