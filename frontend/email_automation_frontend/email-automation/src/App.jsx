import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import CustomerScraper from './components/CustomerScraper'
import RecipientDashboard from './components/RecipientDashboard'
import MailboxView from './components/MailboxView'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import EmailView from './components/EmailView'
import ContactView from './components/ContactView'
import CampaignView from './components/CampaignView'
import EmailMarketingPage from './components/List'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import Settings from './components/Settings'
import { authAPI } from './utils/apiLayer'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  const location = useLocation()

  if (!token || !authAPI.validateToken()) {
    // Remove invalid token
    localStorage.removeItem('token')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

// Create a wrapper component to handle the conditional rendering
function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="flex h-screen bg-gray-50">
      {!isAuthPage && <Sidebar />}
      <main className={`${isAuthPage ? 'w-full' : 'flex-1'} overflow-auto`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/customers" element={
            <ProtectedRoute><CustomerScraper /></ProtectedRoute>
          } />
          <Route path="/recipients" element={
            <ProtectedRoute><RecipientDashboard /></ProtectedRoute>
          } />
          <Route path="/mailbox" element={
            <ProtectedRoute><MailboxView /></ProtectedRoute>
          } />
          <Route path="/campaign" element={
            <ProtectedRoute><CampaignView /></ProtectedRoute>
          } />
          <Route path="/lists" element={
            <ProtectedRoute><EmailMarketingPage /></ProtectedRoute>
          } />
          <Route path="/emailview/:id" element={
            <ProtectedRoute><EmailView /></ProtectedRoute>
          } />
          <Route path="/contactView/:id" element={
            <ProtectedRoute><ContactView /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute><Settings /></ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute><CustomerScraper /></ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
