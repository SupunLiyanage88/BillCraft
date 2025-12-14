import { Button } from '@mui/material';
import type { ReactNode } from 'react';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick: () => void;
  endIcon?: ReactNode;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  primaryColor?: string;
}

function PrimaryButton({ 
  children, 
  onClick, 
  endIcon, 
  size = 'large',
  fullWidth = false,
  primaryColor = '#2563EB'
}: PrimaryButtonProps) {
  return (
    <Button
      variant="contained"
      size={size}
      onClick={onClick}
      endIcon={endIcon}
      fullWidth={fullWidth}
      sx={{
        backgroundColor: primaryColor,
        px: 5,
        py: 1.75,
        fontSize: '1.05rem',
        fontWeight: 600,
        textTransform: 'none',
        borderRadius: 2,
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: '#1D4ED8',
          boxShadow: 'none',
        },
      }}
    >
      {children}
    </Button>
  );
}

export default PrimaryButton;
