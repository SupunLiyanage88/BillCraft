import { Routes, Route } from 'react-router-dom'
import Layout from '../components/Layout'
import Home from '../pages/Home'
import Template from '../pages/Template'
import Invoice from '../pages/Invoice'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="template" element={<Template />} />
        <Route path="invoice" element={<Invoice />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
