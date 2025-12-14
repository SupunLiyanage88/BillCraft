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
        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          backgroundColor: '#1D4ED8',
          boxShadow: '0 6px 20px rgba(37, 99, 235, 0.35)',
          transform: 'translateY(-2px)',
        },
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
        },
        '& .MuiButton-endIcon': {
          transition: 'transform 0.3s ease',
        },
        '&:hover .MuiButton-endIcon': {
          transform: 'translateX(4px)',
        },
      }}
    >
      {children}
    </Button>
  );
}

export default PrimaryButton;
