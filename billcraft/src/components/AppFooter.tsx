import { Box, Container, Stack, Typography } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

interface AppFooterProps {
  primaryColor: string;
  textColor: string;
  textLightColor: string;
  borderColor: string;
}

function AppFooter({ primaryColor, textColor, textLightColor, borderColor }: AppFooterProps) {
  return (
    <Box sx={{ borderTop: `1px solid ${borderColor}`, py: 4 }}>
      <Container maxWidth="lg">
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems="center"
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <ReceiptLongIcon sx={{ fontSize: 24, color: primaryColor }} />
            <Typography variant="body2" fontWeight={600} color={textColor}>
              BillCraft
            </Typography>
          </Stack>
          
          <Typography variant="body2" color={textLightColor}>
            © {new Date().getFullYear()} BillCraft. Made with ❤️
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

export default AppFooter;
