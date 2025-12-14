import { useState, useEffect } from 'react';
import {
  Drawer,
  Paper,
  IconButton,
  Typography,
  Box,
  Chip,
  Stack,
  Alert,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getInvoiceHistory, deleteInvoiceFromHistory } from '../../utils/localStorage';
import type { SavedInvoice } from '../../types/invoice';

interface InvoiceHistoryProps {
  open: boolean;
  onLoadInvoice: (invoice: SavedInvoice) => void;
}

function InvoiceHistory({ open, onLoadInvoice }: InvoiceHistoryProps) {
  const [history, setHistory] = useState<SavedInvoice[]>([]);

  useEffect(() => {
    loadHistory();
  }, [open]);

  const loadHistory = () => {
    const invoices = getInvoiceHistory();
    setHistory(invoices);
  };

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      deleteInvoiceFromHistory(id);
      loadHistory();
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const handleLoad = (invoice: SavedInvoice) => {
    onLoadInvoice(invoice);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      variant="persistent"
      sx={{
        width: 320,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 320,
          boxSizing: 'border-box',
          backgroundColor: '#fafbfc',
          borderLeft: 'none',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        },
      }}
    >
      <Box sx={{ 
        p: 3, 
        backgroundColor: '#fff', 
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight="700" color="text.primary">
            Saved Invoices
          </Typography>
          <Tooltip title="Refresh" placement="left">
            <IconButton 
              onClick={loadHistory} 
              size="small"
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                  transform: 'rotate(180deg)',
                },
                transition: 'transform 0.3s',
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip
            label={`${history.length} / 20`}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
              backgroundColor: 'primary.50',
              color: 'primary.main',
            }}
          />
          <Typography variant="caption" color="text.secondary">
            saved
          </Typography>
        </Stack>
      </Box>
      
      <Box sx={{ overflowY: 'auto', height: '100%', p: 2 }}>
        {history.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Alert 
              severity="info"
              sx={{
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: 22,
                },
              }}
            >
              No saved invoices. Click "Save Draft" to start.
            </Alert>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {history.map((invoice) => (
              <Paper
                key={invoice.id}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)',
                  },
                }}
                onClick={() => handleLoad(invoice)}
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="subtitle1" fontWeight="700" color="text.primary">
                      #{invoice.invoiceHeader.invoiceNumber}
                    </Typography>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Load Invoice" placement="left">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoad(invoice);
                          }}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'primary.50',
                            },
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" placement="left">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => handleDelete(invoice.id, e)}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'error.50',
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                  
                  <Chip
                    label={invoice.client.name || 'No client'}
                    size="small"
                    variant="outlined"
                    sx={{ 
                      alignSelf: 'flex-start',
                      fontWeight: 500,
                      borderRadius: 1.5,
                    }}
                  />
                  
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {formatDate(invoice.savedAt)}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip
                      label={`${invoice.items.length} item${invoice.items.length !== 1 ? 's' : ''}`}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem',
                        height: 22,
                        backgroundColor: 'grey.100',
                        fontWeight: 500,
                      }}
                    />
                    <Chip
                      label={invoice.invoiceHeader.dueDate}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem',
                        height: 22,
                        backgroundColor: 'grey.100',
                        fontWeight: 500,
                      }}
                    />
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}

export default InvoiceHistory;
