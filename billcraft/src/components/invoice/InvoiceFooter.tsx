import { Box, Typography } from '@mui/material';

interface InvoiceFooterProps {
  thankYouMessage: string;
  businessName: string;
  phone: string;
  email: string;
  authorizedPerson?: string;
  primaryColor?: string;
  isGeneratingPDF?: boolean;
}

function InvoiceFooter({ 
  thankYouMessage, 
  businessName, 
  phone, 
  email, 
  authorizedPerson,
  primaryColor = '#1976d2',
  isGeneratingPDF = false
}: InvoiceFooterProps) {
  return (
    <Box sx={{ 
      textAlign: 'center', 
      marginTop: isGeneratingPDF ? 4 : { xs: 2, md: 4 }, 
      paddingY: isGeneratingPDF ? 3 : { xs: 2, sm: 3 }, 
      backgroundColor: '#f8f9fc', 
      borderRadius: 2 
    }}>
      <Typography variant="h6" fontWeight="700" gutterBottom sx={{ fontSize: isGeneratingPDF ? '1.25rem' : { xs: '1rem', sm: '1.25rem' }, color: primaryColor }}>
        {thankYouMessage}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1, fontSize: isGeneratingPDF ? '0.875rem' : { xs: '0.75rem', sm: '0.875rem' } }}>
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
  );
}

export default InvoiceFooter;
