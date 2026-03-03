import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Submit from './pages/Submit'
import Confirm from './pages/Confirm'
import ListingDetail from './pages/ListingDetail'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}