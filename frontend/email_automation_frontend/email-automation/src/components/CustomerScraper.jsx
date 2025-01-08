import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateCampaignModal from './CreateCampaignModal'

function CustomerScraper() {
  const [customers, setCustomers] = useState([])
  const [selectedCustomers, setSelectedCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const navigate = useNavigate()

  const handleScrapeData = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/scrap');
      const data = await res.json();
      console.log('res: ' + data?.data)
      setCustomers(data?.data)
    } catch (error) {
      console.error('Error in handleScrapeData:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSelectCustomer = (customer) => {
    setSelectedCustomers(prev => 
      prev.findIndex((company) => company?.id === customer?.id) !== -1
        ? prev.filter(id => id?.id !== customer?.id)
        : [...prev, customer]
    )
  }

  useEffect(() => {
    console.log('selectedCustomers', selectedCustomers)
  }, [selectedCustomers])

  const handleSelectAll = () => {
    setSelectedCustomers(
      selectedCustomers.length === customers.length
        ? []
        : customers.flatMap(customer => customer?.Employee_List?.map(employee => ({...employee, ...customer, Employee_List: undefined})))
    )
  }

  const handleAddToRecipients = () => {
    if (selectedCustomers.length === 0) {
      alert('Please select at least one customer')
      return
    }
    setShowCampaignModal(true)
  }

  const handleAddToRecipientsSubmit = () => {
    navigate('/recipients')
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
              onClick={handleAddToRecipients}
              disabled={selectedCustomers.length === 0}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-green-300"
            >
              Upload to active campaign
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
          <div className='overflow-x-auto'>
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Bio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LinkedIn URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company LinkedIn URL</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map(company => (
                company?.Employee_List?.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.findIndex((select) => select.id === employee.id) !== -1}
                        onChange={() => handleSelectCustomer({
                          ...company,
                          Employee_List: undefined,
                          ...employee
                        })}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee?.name || "--"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee?.shortBio || "--"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee?.designation || "--"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee?.email || "--"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee?.profileLinks?.linkedinHandle || "--"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{company?.Name || "--"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{company?.Description || "--"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{company?.Domain || "--"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{company?.LinkedIn_URL || "--"}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {showCampaignModal && (
        <CreateCampaignModal
          onClose={() => setShowCampaignModal(false)}
          selectedCustomers={selectedCustomers}
          // onSubmit={handleAddToRecipientsSubmit}
        />
      )}
    </div>
  )
}

export default CustomerScraper 