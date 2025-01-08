import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import CustomerScraper from './components/CustomerScraper'
import RecipientDashboard from './components/RecipientDashboard'
import MailboxView from './components/MailboxView'

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
            <Route path="/" element={<CustomerScraper />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
