import { Card, CardContent, Stack, Box, Typography, alpha } from '@mui/material';
import type { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  primaryColor: string;
  textColor: string;
  textLightColor: string;
  borderColor: string;
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  primaryColor, 
  textColor, 
  textLightColor,
  borderColor 
}: FeatureCardProps) {
  return (
    <Card
      sx={{
        flex: 1,
        border: `1px solid ${borderColor}`,
        borderRadius: 2,
        boxShadow: 'none',
        textAlign: 'center',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
          borderColor: primaryColor,
        },
        '&:hover .feature-icon': {
          transform: 'scale(1.1)',
          backgroundColor: primaryColor,
          color: '#fff',
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={2} alignItems="center">
          <Box
            className="feature-icon"
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: alpha(primaryColor, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: primaryColor,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" fontWeight={600} color={textColor}>
            {title}
          </Typography>
          <Typography variant="body2" color={textLightColor}>
            {description}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default FeatureCard;
