import { Route, Routes } from 'react-router-dom'

import { Layout } from '../components/Layout/Layout'
import { AssetDetail } from './routes/AssetDetail'
import { Assets } from './routes/Assets'
import { Dashboard } from './routes/Dashboard'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="assets" element={<Assets />} />
        <Route path="assets/:id" element={<AssetDetail />} />
      </Route>
    </Routes>
  )
}


