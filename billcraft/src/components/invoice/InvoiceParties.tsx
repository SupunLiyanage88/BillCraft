import { Stack, Box, Typography, TextField, Divider } from '@mui/material';
import type { SellerDetails, ClientDetails } from '../../types/invoice';

interface InvoicePartiesProps {
  seller: SellerDetails;
  client: ClientDetails;
  isGeneratingPDF: boolean;
  onClientUpdate: (field: keyof ClientDetails, value: string) => void;
}

function InvoiceParties({ seller, client, isGeneratingPDF, onClientUpdate }: InvoicePartiesProps) {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 4 }}>
      <Box sx={{ flex: 1, padding: { xs: 1.5, sm: 2 }, backgroundColor: '#f8f9fc', borderRadius: 2 }}>
        <Typography variant="overline" fontWeight="700" color="primary.main" gutterBottom>
          FROM
        </Typography>
        <Typography variant="h6" fontWeight="700" gutterBottom>
          {seller.businessName}
        </Typography>
        {seller.street && <Typography variant="body2" color="text.secondary">{seller.street}</Typography>}
        {seller.city && <Typography variant="body2" color="text.secondary">{seller.city}, {seller.state} {seller.postcode}</Typography>}
        {seller.country && <Typography variant="body2" color="text.secondary">{seller.country}</Typography>}
        <Divider sx={{ marginY: 1.5, borderColor: '#e0e0e0' }} />
        <Typography variant="body2" color="text.secondary">
          <strong>Phone:</strong> {seller.phone}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Email:</strong> {seller.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>ABN:</strong> {seller.abn}
        </Typography>
        {seller.authorizedPerson && (
          <Typography variant="body2" color="text.secondary">
            <strong>Authorized Person:</strong> {seller.authorizedPerson}
          </Typography>
        )}
      </Box>

      <Box sx={{ flex: 1, padding: { xs: 1.5, sm: 2 }, backgroundColor: '#f8f9fc', borderRadius: 2 }}>
        <Typography variant="overline" fontWeight="700" color="primary.main" gutterBottom>
          BILL TO
        </Typography>
        {isGeneratingPDF ? (
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight="700">{client.name}</Typography>
            {client.address && <Typography variant="body2" color="text.secondary">{client.address}</Typography>}
            {client.email && <Typography variant="body2" color="text.secondary">{client.email}</Typography>}
            {client.phone && <Typography variant="body2" color="text.secondary">{client.phone}</Typography>}
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            <TextField
              fullWidth
              label="Client Name"
              value={client.name}
              onChange={(e) => onClientUpdate('name', e.target.value)}
              size="small"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Client Address (Optional)"
              value={client.address}
              onChange={(e) => onClientUpdate('address', e.target.value)}
              size="small"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Client Email (Optional)"
              value={client.email}
              onChange={(e) => onClientUpdate('email', e.target.value)}
              size="small"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Client Phone (Optional)"
              value={client.phone}
              onChange={(e) => onClientUpdate('phone', e.target.value)}
              size="small"
              variant="outlined"
            />
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

export default InvoiceParties;
