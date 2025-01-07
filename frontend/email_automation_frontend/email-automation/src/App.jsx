import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import CustomerScraper from './components/CustomerScraper'
import MailboxView from './components/MailboxView'
import ActiveCampaigns from './components/ActiveCampaigns'
import CampaignView from './components/CampaignView'

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/customers" element={<CustomerScraper />} />
            <Route path="/mailbox" element={<MailboxView />} />
            <Route path="/campaigns" element={<ActiveCampaigns />} />
            <Route path="/campaigns/:id" element={<CampaignView />} />
            <Route path="/" element={<CustomerScraper />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
