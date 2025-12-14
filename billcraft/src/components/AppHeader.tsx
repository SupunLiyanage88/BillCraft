import { Box, Container, Stack, Typography, Button } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

interface AppHeaderProps {
  primaryColor: string;
  textColor: string;
  borderColor: string;
  onGetStarted: () => void;
}

function AppHeader({ primaryColor, textColor, borderColor, onGetStarted }: AppHeaderProps) {
  return (
    <Box sx={{ py: 3, borderBottom: `1px solid ${borderColor}` }}>
      <Container maxWidth="lg">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1.5}
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
              },
              '&:hover .logo-icon': {
                transform: 'rotate(-10deg)',
              },
            }}
          >
            <ReceiptLongIcon 
              className="logo-icon"
              sx={{ 
                fontSize: 28, 
                color: primaryColor,
                transition: 'transform 0.3s ease',
              }} 
            />
            <Typography variant="h6" fontWeight="700" color={textColor}>
              BillCraft
            </Typography>
          </Stack>
          
          <Button
            variant="contained"
            onClick={onGetStarted}
            sx={{
              backgroundColor: primaryColor,
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: '#1D4ED8',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            Get Started
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

export default AppHeader;
