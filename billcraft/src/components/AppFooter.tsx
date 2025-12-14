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
    <Box 
      className="animate-fadeIn animate-delay-500"
      sx={{ borderTop: `1px solid ${borderColor}`, py: 4 }}
    >
      <Container maxWidth="lg">
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems="center"
          spacing={2}
        >
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1.5}
            sx={{
              cursor: 'pointer',
              transition: 'opacity 0.3s ease',
              '&:hover': {
                opacity: 0.7,
              },
            }}
          >
            <ReceiptLongIcon sx={{ fontSize: 24, color: primaryColor }} />
            <Typography variant="body2" fontWeight={600} color={textColor}>
              BillCraft
            </Typography>
          </Stack>
          
          <Typography 
            variant="body2" 
            color={textLightColor}
            sx={{
              '& span': {
                display: 'inline-block',
                transition: 'transform 0.3s ease',
              },
              '&:hover span': {
                transform: 'scale(1.2)',
              },
            }}
          >
            © {new Date().getFullYear()} BillCraft. Made with <span>❤️</span>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

export default AppFooter;
