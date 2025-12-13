import { Typography, Stack, Chip, Box } from "@mui/material";

function Home() {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to BillCraft!
      </Typography>
      <Typography variant="body1" gutterBottom>
        This is a sample application using React and Material-UI.
      </Typography>
      <Stack direction="row" spacing={1}>
        <Chip label="React" color="primary" />
        <Chip label="Material-UI" color="secondary" />
        <Chip label="Vite" color="success" />
      </Stack>
    </Box>
  );
}

export default Home;
