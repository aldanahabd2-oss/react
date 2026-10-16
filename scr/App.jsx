import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import { AssetProvider } from './context/AssetContext'
import AboutPage from './pages/AboutPage'
import AddAssetPage from './pages/AddAssetPage'
import AssetsPage from './pages/AssetsPage'
import './App.css'

function App() {
  return (
    <AssetProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <main className="main">
            <Routes>
              <Route path="/" element={<AssetsPage />} />
              <Route path="/add" element={<AddAssetPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="footer">
            <span>RectAssets · SE411 Part 1 · Fall 2026-27</span>
          </footer>
        </div>
      </BrowserRouter>
    </AssetProvider>
  )
}

export default App
