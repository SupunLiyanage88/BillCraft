import { Box, Typography, Stack } from '@mui/material';
import type { BankDetails } from '../../types/invoice';

interface PaymentInfoProps {
  bankDetails: BankDetails;
  isGeneratingPDF?: boolean;
}

function PaymentInfo({ bankDetails, isGeneratingPDF = false }: PaymentInfoProps) {
  return (
    <Box sx={{ 
      padding: isGeneratingPDF ? 3 : { xs: 2, sm: 3 }, 
      backgroundColor: '#f8f9fc', 
      borderRadius: 2, 
      border: '1px solid #e0e0e0',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'visible'
    }}>
      <Typography variant="h6" fontWeight="700" gutterBottom color="text.primary" sx={{ fontSize: isGeneratingPDF ? '1.25rem' : { xs: '1.1rem', sm: '1.25rem' } }}>
        Payment Information
      </Typography>
      <Stack spacing={2} sx={{ marginTop: 2, width: '100%' }}>
        <Stack 
          direction={isGeneratingPDF ? 'row' : { xs: 'column', sm: 'row' }} 
          spacing={isGeneratingPDF ? 4 : 3}
          sx={{ width: '100%' }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="600">ACCOUNT NAME</Typography>
            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{bankDetails.accountName}</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="600">ACCOUNT NUMBER</Typography>
            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{bankDetails.accountNumber}</Typography>
          </Box>
        </Stack>
        <Stack 
          direction={isGeneratingPDF ? 'row' : { xs: 'column', sm: 'row' }} 
          spacing={isGeneratingPDF ? 4 : 3}
          sx={{ width: '100%' }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="600">BSB</Typography>
            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{bankDetails.bsb}</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="600">BANK NAME</Typography>
            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{bankDetails.bankName}</Typography>
          </Box>
        </Stack>
        {bankDetails.paymentNotes && (
          <Box sx={{ width: '100%' }}>
            <Typography variant="caption" color="text.secondary" fontWeight="600">NOTES</Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>{bankDetails.paymentNotes}</Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

export default PaymentInfo;
