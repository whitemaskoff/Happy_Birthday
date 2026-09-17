import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ContentProvider } from './lib/contentStore'
import Admin from './pages/Admin'
import Experience from './pages/Experience'

export default function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Experience />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  )
}
