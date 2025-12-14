import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { getInvoiceHistory, deleteInvoiceFromHistory } from '../../utils/localStorage';
import type { SavedInvoice } from '../../types/invoice';

interface InvoiceHistoryProps {
  open: boolean;
  onClose: () => void;
  onLoadInvoice: (invoice: SavedInvoice) => void;
}

function InvoiceHistory({ open, onClose, onLoadInvoice }: InvoiceHistoryProps) {
  const [history, setHistory] = useState<SavedInvoice[]>([]);

  useEffect(() => {
    if (open) {
      loadHistory();
    }
  }, [open]);

  const loadHistory = () => {
    const invoices = getInvoiceHistory();
    setHistory(invoices);
  };

  const handleDelete = (id: string) => {
    try {
      deleteInvoiceFromHistory(id);
      loadHistory();
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const handleLoad = (invoice: SavedInvoice) => {
    onLoadInvoice(invoice);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Invoice History</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        {history.length === 0 ? (
          <Alert severity="info">No saved invoices found. Save an invoice to see it here.</Alert>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Showing {history.length} of {history.length} saved invoice{history.length !== 1 ? 's' : ''} (max 20)
            </Typography>
            <List>
              {history.map((invoice) => (
                <ListItem
                  key={invoice.id}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: '#fafafa',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1" fontWeight="bold">
                          Invoice #{invoice.invoiceHeader.invoiceNumber}
                        </Typography>
                        <Chip
                          label={invoice.client.name || 'No client'}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    }
                    secondary={
                      <Stack spacing={0.5} sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Saved: {formatDate(invoice.savedAt)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Due: {invoice.invoiceHeader.dueDate} | {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
                        </Typography>
                      </Stack>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        edge="end"
                        aria-label="load"
                        onClick={() => handleLoad(invoice)}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(invoice.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default InvoiceHistory;
