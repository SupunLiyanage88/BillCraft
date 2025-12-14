import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type { InvoiceItem } from '../../types/invoice';

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  isGeneratingPDF: boolean;
  onItemChange: (id: number, field: keyof InvoiceItem, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (id: number) => void;
  calculateItemAmount: (item: InvoiceItem) => number;
  primaryColor?: string;
}

function InvoiceItemsTable({ 
  items, 
  isGeneratingPDF, 
  onItemChange, 
  onAddItem, 
  onRemoveItem,
  calculateItemAmount,
  primaryColor = '#1976d2'
}: InvoiceItemsTableProps) {
  return (
    <>
      <Typography variant="h6" fontWeight="700" gutterBottom color="text.primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        Items & Services
      </Typography>
      <TableContainer sx={{ marginTop: 2, border: '1px solid #e0e0e0', borderRadius: 1, overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
              <TableCell sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, padding: { xs: '8px 4px', sm: '16px' } }}>Description</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, padding: { xs: '8px 4px', sm: '16px' } }}>Qty</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, padding: { xs: '8px 4px', sm: '16px' } }}>Price</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, padding: { xs: '8px 4px', sm: '16px' } }}>Disc.</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, padding: { xs: '8px 4px', sm: '16px' } }}>Amount</TableCell>
              {!isGeneratingPDF && (
                <TableCell align="center" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, padding: { xs: '8px 4px', sm: '16px' } }}>Action</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ padding: { xs: '8px 4px', sm: '16px' } }}>
                  {isGeneratingPDF ? (
                    <Typography variant="body2">{item.description}</Typography>
                  ) : (
                    <TextField
                      fullWidth
                      value={item.description}
                      onChange={(e) => onItemChange(item.id, 'description', e.target.value)}
                      size="small"
                      placeholder="Item description"
                    />
                  )}
                </TableCell>
                <TableCell align="right" sx={{ padding: { xs: '8px 4px', sm: '16px' } }}>
                  {isGeneratingPDF ? (
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{item.quantity}</Typography>
                  ) : (
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) => onItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      size="small"
                      sx={{ width: { xs: 60, sm: 80 } }}
                      inputProps={{ min: 0, step: 1 }}
                    />
                  )}
                </TableCell>
                <TableCell align="right" sx={{ padding: { xs: '8px 4px', sm: '16px' } }}>
                  {isGeneratingPDF ? (
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>${item.unitPrice.toFixed(2)}</Typography>
                  ) : (
                    <TextField
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => onItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      size="small"
                      sx={{ width: { xs: 70, sm: 100 } }}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  )}
                </TableCell>
                <TableCell align="right" sx={{ padding: { xs: '8px 4px', sm: '16px' } }}>
                  {isGeneratingPDF ? (
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>${item.discount.toFixed(2)}</Typography>
                  ) : (
                    <TextField
                      type="number"
                      value={item.discount}
                      onChange={(e) => onItemChange(item.id, 'discount', parseFloat(e.target.value) || 0)}
                      size="small"
                      sx={{ width: { xs: 70, sm: 100 } }}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  )}
                </TableCell>
                <TableCell align="right" sx={{ padding: { xs: '8px 4px', sm: '16px' } }}>
                  <Typography variant="body2" fontWeight="600" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, color: primaryColor }}>
                    ${calculateItemAmount(item).toFixed(2)}
                  </Typography>
                </TableCell>
                {!isGeneratingPDF && (
                  <TableCell align="center" sx={{ padding: { xs: '8px 4px', sm: '16px' } }}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onRemoveItem(item.id)}
                      disabled={items.length === 1}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {!isGeneratingPDF && (
        <Button
          startIcon={<AddIcon />}
          onClick={onAddItem}
          sx={{ 
            marginTop: 2, 
            width: { xs: '100%', sm: 'auto' },
            borderColor: primaryColor,
            color: primaryColor,
            '&:hover': {
              borderColor: primaryColor,
              backgroundColor: `${primaryColor}10`,
            }
          }}
          variant="outlined"
        >
          Add Item
        </Button>
      )}
    </>
  );
}

export default InvoiceItemsTable;
