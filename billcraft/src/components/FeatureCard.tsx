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
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={2} alignItems="center">
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: alpha(primaryColor, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: primaryColor,
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
