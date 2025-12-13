import { Typography, Stack, Box, Button, Container, Card, CardContent, alpha, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import LockIcon from '@mui/icons-material/Lock';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupsIcon from '@mui/icons-material/Groups';
import LaunchIcon from '@mui/icons-material/Launch';
import StarIcon from '@mui/icons-material/Star';
import BoltIcon from '@mui/icons-material/Bolt';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const colors = {
    primary: '#2563EB',
    background: '#FFFFFF',
    text: '#0F172A',
    textLight: '#64748B',
    border: '#E2E8F0',
  };

  const features = [
    {
      icon: <SpeedIcon sx={{ fontSize: 28 }} />,
      title: 'Fast & Simple',
      description: 'Create invoices in seconds'
    },
    {
      icon: <LockIcon sx={{ fontSize: 28 }} />,
      title: 'Private',
      description: 'Your data stays with you'
    },
    {
      icon: <CloudDownloadIcon sx={{ fontSize: 28 }} />,
      title: 'Export Ready',
      description: 'Download as PDF instantly'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background }}>
      {/* Simple Header */}
      <Box sx={{ py: 3, borderBottom: `1px solid ${colors.border}` }}>
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <ReceiptLongIcon sx={{ fontSize: 28, color: colors.primary }} />
              <Typography variant="h6" fontWeight="700" color={colors.text}>
                BillCraft
              </Typography>
            </Stack>
            
            <Button
              variant="contained"
              onClick={() => navigate('/invoice')}
              sx={{
                backgroundColor: colors.primary,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#1D4ED8',
                  boxShadow: 'none',
                },
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="md" sx={{ py: { xs: 10, md: 16 } }}>
        <Stack spacing={5} alignItems="center" textAlign="center">
          <Stack spacing={3}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                lineHeight: 1.2,
                color: colors.text,
                letterSpacing: '-0.02em',
              }}
            >
              Professional Invoices
              <br />
              Made Simple
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1.125rem', md: '1.25rem' },
                fontWeight: 400,
                lineHeight: 1.6,
                color: colors.textLight,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Create beautiful invoices in seconds. No signup required.
              Completely free.
            </Typography>
          </Stack>
          
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/invoice')}
            endIcon={<ArrowForwardIcon />}
            sx={{
              backgroundColor: colors.primary,
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
            Create Invoice
          </Button>
        </Stack>
      </Container>

      {/* Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#F9FAFB' }}>
        <Container maxWidth="lg">
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={4}
            justifyContent="center"
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  flex: 1,
                  border: `1px solid ${colors.border}`,
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
                        backgroundColor: alpha(colors.primary, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.primary,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} color={colors.text}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color={colors.textLight}>
                      {feature.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Simple CTA */}
      <Container maxWidth="md" sx={{ py: { xs: 10, md: 14 } }}>
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Stack spacing={2}>
            <Typography variant="h3" fontWeight={700} color={colors.text}>
              Ready to get started?
            </Typography>
            <Typography variant="body1" color={colors.textLight}>
              Join thousands creating professional invoices today
            </Typography>
          </Stack>
          
          <Stack spacing={2} alignItems="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/invoice')}
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: colors.primary,
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
              Start Creating Free
            </Button>
            
            <Stack direction="row" spacing={3} sx={{ pt: 2 }}>
              {['No signup', 'Free forever', 'Private'].map((item, index) => (
                <Stack key={index} direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon sx={{ fontSize: 18, color: colors.primary }} />
                  <Typography variant="body2" color={colors.textLight}>
                    {item}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Container>

      {/* Minimal Footer */}
      <Box sx={{ borderTop: `1px solid ${colors.border}`, py: 4 }}>
        <Container maxWidth="lg">
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems="center"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <ReceiptLongIcon sx={{ fontSize: 24, color: colors.primary }} />
              <Typography variant="body2" fontWeight={600} color={colors.text}>
                BillCraft
              </Typography>
            </Stack>
            
            <Typography variant="body2" color={colors.textLight}>
              © {new Date().getFullYear()} BillCraft. Made with ❤️
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;