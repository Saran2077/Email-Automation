import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateCampaignModal from './CreateCampaignModal'

function CustomerScraper() {
  const [customers, setCustomers] = useState([])
  const [selectedCustomers, setSelectedCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const navigate = useNavigate()

  // Dummy data for demonstration
  const dummyCustomers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', company: 'ABC Corp' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', company: 'XYZ Ltd' },
  ]

  const handleScrapeData = async () => {
    setLoading(true)
    setTimeout(() => {
      setCustomers(dummyCustomers)
      setLoading(false)
    }, 1000)
  }

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    )
  }

  const handleSelectAll = () => {
    setSelectedCustomers(
      selectedCustomers.length === customers.length
        ? []
        : customers.map(customer => customer.id)
    )
  }

  const handleCreateCampaign = () => {
    if (selectedCustomers.length === 0) {
      alert('Please select at least one customer')
      return
    }
    setShowCampaignModal(true)
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Customer Data</h2>
        <div className="flex gap-3">
          <button
            onClick={handleScrapeData}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Scraping...' : 'Scrape Customer Data'}
          </button>
          {customers.length > 0 && (
            <button
              onClick={handleCreateCampaign}
              disabled={selectedCustomers.length === 0}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-green-300"
            >
              Create Campaign
            </button>
          )}
        </div>
      </div>

      {customers.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCustomers.length === customers.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300"
              />
              <span className="ml-2">Select All</span>
            </label>
          </div>
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map(customer => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleSelectCustomer(customer.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.company}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCampaignModal && (
        <CreateCampaignModal
          onClose={() => setShowCampaignModal(false)}
          selectedCustomersCount={selectedCustomers.length}
        />
      )}
    </div>
  )
}

export default CustomerScraper 