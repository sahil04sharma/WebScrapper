import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Stories from './pages/Stories'
import StoryDetail from './pages/StoryDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Bookmarks from './pages/Bookmarks'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Stories />} />
          <Route path="/stories/:id" element={<StoryDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<p>404 — Page not found</p>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
