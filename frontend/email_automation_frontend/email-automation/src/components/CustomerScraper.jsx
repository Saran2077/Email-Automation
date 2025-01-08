import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import AddToRecipientsModal from './AddToRecipientsModal'
import { scrapAPI, recipientAPI } from '../utils/apiLayer'

function CustomerScraper() {
  const [customers, setCustomers] = useState([])
  const [selectedCustomers, setSelectedCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const navigate = useNavigate()

  const handleScrapeData = async () => {
    setLoading(true)
    try {
      const response = await scrapAPI.fetchCustomers()
      if (!response?.data) {
        throw new Error('No data received from scraping')
      }
      setCustomers(response.data)
    } catch (error) {
      console.error('Error in handleScrapeData:', error)
      toast.error(error.message || 'Failed to fetch customer data')
      setCustomers([])
    } finally {
      setLoading(false)
    }
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

  const handleAddToRecipients = () => {
    if (selectedCustomers.length === 0) {
      toast.warning('Please select at least one customer')
      return
    }
    setShowCampaignModal(true)
  }

  const prepareRecipientPayload = (company, employee) => {
    if (!company || !employee) {
      throw new Error('Invalid company or employee data')
    }

    return {
      name: employee.name || '',
      email: employee.email || `contact@${company.Domain || ''}`,
      company: company.Name || '',
      country: company.Country || '',
      city: company.City || '',
      state: company.State || '',
      designation: employee.designation || '',
      linkedinHandle: employee.profileLinks?.linkedinHandle || '',
      companyDomain: company.Domain || '',
      stage: 'contact' // Default stage, will be overridden by modal selection
    }
  }

  const handleAddToRecipientsSubmit = async (selectedStage) => {
    if (!selectedStage) {
      toast.error('Please select a stage')
      return
    }

    setLoading(true)
    try {
      const recipientsToCreate = selectedCustomers.map(selectionId => {
        const [companyId, employeeIndex] = selectionId.split('-')
        const company = customers.find(c => c.id === companyId)
        const employee = company?.Employee_List[parseInt(employeeIndex)]
        
        if (!company || !employee) {
          throw new Error('Invalid selection')
        }

        const payload = prepareRecipientPayload(company, employee)
        payload.stage = selectedStage
        return payload
      })

      if (recipientsToCreate.length === 0) {
        throw new Error('No valid recipients to create')
      }

      await recipientAPI.bulkCreate(recipientsToCreate)
      toast.success(`Successfully created ${recipientsToCreate.length} recipients`)
      setShowCampaignModal(false)
      setSelectedCustomers([])
      navigate('/recipients', { replace: true })
    } catch (error) {
      console.error('Error creating recipients:', error)
      toast.error(error.response?.data?.error || error.message || 'Failed to create recipients')
    } finally {
      setLoading(false)
    }
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
              disabled={selectedCustomers.length === 0 || loading}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-green-300"
            >
              Upload to Recipients
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
                  <tr key={company.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(company.id)}
                        onChange={() => handleSelectCustomer(company.id)}
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
        <AddToRecipientsModal
          onClose={() => setShowCampaignModal(false)}
          selectedCustomersCount={selectedCustomers.length}
          onSubmit={handleAddToRecipientsSubmit}
          loading={loading}
        />
      )}
    </div>
  )
}

export default CustomerScraper 