import { Typography, Stack, Chip, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReceiptIcon from '@mui/icons-material/Receipt';

function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to BillCraft!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Create professional invoices for your business with ease.
      </Typography>
      <Stack direction="row" spacing={1} sx={{ marginY: 2 }}>
        <Chip label="React" color="primary" />
        <Chip label="Material-UI" color="secondary" />
        <Chip label="Vite" color="success" />
      </Stack>
      
      <Button
        variant="contained"
        color="primary"
        startIcon={<ReceiptIcon />}
        onClick={() => navigate('/invoice')}
        sx={{ marginTop: 2 }}
      >
        Create Invoice
      </Button>
    </Box>
  );
}

export default Home;
