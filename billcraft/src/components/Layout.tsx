import { Outlet, Link as RouterLink } from 'react-router-dom'
import { Stack, Box, AppBar, Toolbar, Button } from '@mui/material'
import logo from '../assets/billcraftlogo.png'

function Layout() {
  return (
    <Box>
      {/* navigation bar */}
      <AppBar
        position="static"
        sx={{ height: 70, backgroundColor: '#F4F4F4', borderRadius: 10 }}
      >
        <Toolbar>
          <img src={logo} className="logo" alt="React logo" />
          <Stack spacing={2} direction="row" sx={{ marginLeft: 'auto' }}>
            <Button variant="outlined" component={RouterLink} to="/">
              Home
            </Button>
            <Button variant="outlined" component={RouterLink} to="/template">
              Template
            </Button>
            <Button variant="outlined">About Us</Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  )
}

export default Layout
