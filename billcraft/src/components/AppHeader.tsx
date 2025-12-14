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
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <ReceiptLongIcon sx={{ fontSize: 28, color: primaryColor }} />
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
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#1D4ED8',
                boxShadow: 'none',
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
