import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'

function Layout() {
  return (
    <Box>
      <Outlet />
    </Box>
  )
}

export default Layout
