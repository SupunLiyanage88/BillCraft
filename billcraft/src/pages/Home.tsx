import { Typography, Stack, Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import LockIcon from '@mui/icons-material/Lock';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import FeatureCard from '../components/FeatureCard';
import PrimaryButton from '../components/PrimaryButton';
import type { Feature, ColorScheme } from '../types/home';

function Home() {
  const navigate = useNavigate();

  const colors: ColorScheme = {
    primary: '#2563EB',
    background: '#FFFFFF',
    text: '#0F172A',
    textLight: '#64748B',
    border: '#E2E8F0',
  };

  const features: Feature[] = [
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
      <AppHeader 
        primaryColor={colors.primary}
        textColor={colors.text}
        borderColor={colors.border}
        onGetStarted={() => navigate('/invoice')}
      />

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
          
          <PrimaryButton
            onClick={() => navigate('/invoice')}
            endIcon={<ArrowForwardIcon />}
            primaryColor={colors.primary}
          >
            Create Invoice
          </PrimaryButton>
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
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                primaryColor={colors.primary}
                textColor={colors.text}
                textLightColor={colors.textLight}
                borderColor={colors.border}
              />
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
            <PrimaryButton
              onClick={() => navigate('/invoice')}
              endIcon={<ArrowForwardIcon />}
              primaryColor={colors.primary}
            >
              Start Creating Free
            </PrimaryButton>
            
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

      <AppFooter 
        primaryColor={colors.primary}
        textColor={colors.text}
        textLightColor={colors.textLight}
        borderColor={colors.border}
      />
    </Box>
  );
}

export default Home;