import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import LandingPage from './components/LandingPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
