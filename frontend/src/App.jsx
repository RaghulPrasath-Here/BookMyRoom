import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Submit from './pages/Submit'
import Confirm from './pages/Confirm'
import ListingDetail from './pages/ListingDetail'
import Browse from './pages/Browse'
import Success from './pages/Success'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", background: "#F7F7F7" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/success" element={<Success />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}