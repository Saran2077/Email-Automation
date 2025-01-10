import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import CustomerScraper from './components/CustomerScraper'
import RecipientDashboard from './components/RecipientDashboard'
import MailboxView from './components/MailboxView'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import EmailView from './components/EmailView'
import ContactView from './components/ContactView'

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50">
          <Routes>
            <Route path="/customers" element={<CustomerScraper />} />
            <Route path="/recipients" element={<RecipientDashboard />} />
            <Route path="/mailbox" element={<MailboxView />} />
            <Route path="/emailview" element={<EmailView />} />
            <Route path="/contactView" element={<ContactView />} />
            <Route path="/" element={<CustomerScraper />} />
          </Routes>
        </main>
      </div>
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
  )
}

export default App
