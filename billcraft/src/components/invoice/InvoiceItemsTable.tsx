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
  Box,
  Stack,
  Paper,
  useTheme,
  useMediaQuery,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Mobile Card-based layout for items
  const MobileItemCard = ({ item }: { item: InvoiceItem }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 1.5,
        border: '1px solid',
        borderColor: 'grey.200',
        borderRadius: 2,
        backgroundColor: '#fafbfc',
      }}
    >
      <Stack spacing={2}>
        {/* Description */}
        <TextField
          fullWidth
          value={item.description}
          onChange={(e) => onItemChange(item.id, 'description', e.target.value)}
          size="small"
          placeholder="Item description"
          label="Description"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
            }
          }}
        />

        {/* Quantity, Price, Discount in a row */}
        <Stack direction="row" spacing={1.5}>
          <TextField
            type="number"
            value={item.quantity}
            onChange={(e) => onItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
            size="small"
            label="Qty"
            sx={{ 
              flex: 1,
              '& .MuiOutlinedInput-root': { backgroundColor: 'white' }
            }}
            inputProps={{ min: 0, step: 1, inputMode: 'numeric' }}
          />
          <TextField
            type="number"
            value={item.unitPrice}
            onChange={(e) => onItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
            size="small"
            label="Price"
            sx={{ 
              flex: 1,
              '& .MuiOutlinedInput-root': { backgroundColor: 'white' }
            }}
            inputProps={{ min: 0, step: 0.01, inputMode: 'decimal' }}
          />
          <TextField
            type="number"
            value={item.discount}
            onChange={(e) => onItemChange(item.id, 'discount', parseFloat(e.target.value) || 0)}
            size="small"
            label="Disc."
            sx={{ 
              flex: 1,
              '& .MuiOutlinedInput-root': { backgroundColor: 'white' }
            }}
            inputProps={{ min: 0, step: 0.01, inputMode: 'decimal' }}
          />
        </Stack>

        {/* Amount and Delete button */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="caption" color="text.secondary">Amount</Typography>
            <Typography variant="h6" fontWeight={700} sx={{ color: primaryColor }}>
              ${calculateItemAmount(item).toFixed(2)}
            </Typography>
          </Box>
          <IconButton
            color="error"
            onClick={() => onRemoveItem(item.id)}
            disabled={items.length === 1}
            sx={{
              minWidth: 44,
              minHeight: 44,
              backgroundColor: 'error.50',
              '&:hover': {
                backgroundColor: 'error.100',
              },
              '&.Mui-disabled': {
                backgroundColor: 'grey.100',
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );

  return (
    <>
      <Typography variant="h6" fontWeight="700" gutterBottom color="text.primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        Items & Services
      </Typography>

      {/* Mobile: Card-based layout, Desktop/PDF: Table layout */}
      {isMobile && !isGeneratingPDF ? (
        <Box sx={{ mt: 2 }}>
          {items.map((item) => (
            <MobileItemCard key={item.id} item={item} />
          ))}
        </Box>
      ) : (
        /* Desktop/PDF: Table layout */
        <TableContainer sx={{ marginTop: 2, border: '1px solid #e0e0e0', borderRadius: 1, overflowX: 'auto' }}>
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem', padding: '12px 16px', minWidth: 180 }}>Description</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem', padding: '12px 16px', minWidth: 70 }}>Qty</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem', padding: '12px 16px', minWidth: 90 }}>Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem', padding: '12px 16px', minWidth: 80 }}>Disc.</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem', padding: '12px 16px', minWidth: 90 }}>Amount</TableCell>
                {!isGeneratingPDF && (
                  <TableCell align="center" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem', padding: '12px 16px', minWidth: 60 }}>Action</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell sx={{ padding: '12px 16px' }}>
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
                  <TableCell align="right" sx={{ padding: '12px 16px' }}>
                    {isGeneratingPDF ? (
                      <Typography variant="body2">{item.quantity}</Typography>
                    ) : (
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => onItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        size="small"
                        sx={{ width: 80 }}
                        inputProps={{ min: 0, step: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ padding: '12px 16px' }}>
                    {isGeneratingPDF ? (
                      <Typography variant="body2">${item.unitPrice.toFixed(2)}</Typography>
                    ) : (
                      <TextField
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => onItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        size="small"
                        sx={{ width: 100 }}
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ padding: '12px 16px' }}>
                    {isGeneratingPDF ? (
                      <Typography variant="body2">${item.discount.toFixed(2)}</Typography>
                    ) : (
                      <TextField
                        type="number"
                        value={item.discount}
                        onChange={(e) => onItemChange(item.id, 'discount', parseFloat(e.target.value) || 0)}
                        size="small"
                        sx={{ width: 100 }}
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ padding: '12px 16px' }}>
                    <Typography variant="body2" fontWeight="600" sx={{ color: primaryColor }}>
                      ${calculateItemAmount(item).toFixed(2)}
                    </Typography>
                  </TableCell>
                  {!isGeneratingPDF && (
                    <TableCell align="center" sx={{ padding: '12px 16px' }}>
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
      )}
      
      {!isGeneratingPDF && (
        <Button
          startIcon={<AddIcon />}
          onClick={onAddItem}
          sx={{ 
            marginTop: 2, 
            width: '100%',
            minHeight: 48,
            borderColor: primaryColor,
            color: primaryColor,
            borderRadius: 2,
            fontWeight: 600,
            '&:hover': {
              borderColor: primaryColor,
              backgroundColor: `${primaryColor}10`,
            },
            '&:active': {
              transform: 'scale(0.98)',
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
