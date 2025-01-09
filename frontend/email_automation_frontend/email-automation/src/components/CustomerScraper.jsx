import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import CreateCampaignModal from './CreateCampaignModal'
import { scrapAPI, recipientAPI } from '../utils/apiLayer'
import FilterModel from './FilterModel'
import { Pagination } from 'antd'

function CustomerScraper() {
  const [customers, setCustomers] = useState({
    meta: {
      total_rows: 0,
    },
    data: []
  })
  const [selectedCustomers, setSelectedCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate()

  const [filters, setFilters] = useState({
    country: [],
    state: [],
    city: [],
    foundedYear: [],
    practiceArea: []
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true)
      try {
        const response = await scrapAPI.fetchCustomers({ filter: filters, from: (currentPage - 1) * 20})
        if (!response?.data) {
          throw new Error('No data received from scraping')
        }
        setCustomers(response)
      } catch (error) {
        console.error('Error in useEffect:', error)
        toast.error(error.message || 'Failed to fetch customer data')
        setCustomers({})
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers();
  }, [currentPage])

// const handleApplyFilters = (newFilters) => {
//   console.log("NEW FILTERS", newFilters)
//   setFilters(newFilters);
//   setShowFilterModal(false);
// };

  const handleScrapeData = async () => {
    setShowFilterModal(true)
  }

  const handleApplyFilters = async (selectedFilters) => {
    setFilters(selectedFilters)
    setLoading(true)
    try {
      const response = await scrapAPI.fetchCustomers({filter: selectedFilters})
      if (!response?.data) {
        throw new Error('No data received from scraping')
      }
      setCustomers(response)
      setShowFilterModal(false)
    } catch (error) {
      console.error('Error in handleScrapeData:', error)
      toast.error(error.message || 'Failed to fetch customer data')
      setCustomers({})
    } finally {
      setLoading(false)
    }
  }

  const handleSelectCustomer = (customer) => {
    setSelectedCustomers(prev => 
      prev.findIndex((company) => company?.id === customer?.id) !== -1
        ? prev.filter(id => id?.id !== customer?.id)
        : [...prev, customer]
    )
  }

  const handleSelectAll = () => {
    setSelectedCustomers(
      selectedCustomers.length === customers?.data.length
        ? []
        : customers?.data.flatMap(customer => customer?.Employee_List?.map(employee => ({...employee, ...customer, Employee_List: undefined})))
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
    // if (!selectedStage) {
    //   toast.error('Please select a stage')
    //   return
    // }

    setLoading(true)
    try {
      const recipientsToCreate = selectedCustomers.map(customer => {
        if (!customer) {
          throw new Error('Invalid customer data')
        }

        const payload = prepareRecipientPayload(customer, {
          name: customer.name,
          email: customer.email,
          designation: customer.designation,
          profileLinks: customer.profileLinks
        })
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
          {customers?.data.length > 0 && (
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

      {showFilterModal && (
        <FilterModel
          onApply={handleApplyFilters}
          onClose={() => setShowFilterModal(false)}
          initialFilters={filters}
        />
      )}

      {customers?.data.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCustomers.length === customers?.data.length}
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
              {customers?.data.map(company => (
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

          <div className="flex justify-center p-4">
            <Pagination
              current={currentPage}
              onChange={setCurrentPage}
              total={customers?.meta?.total_rows}
              pageSize={20}
              showSizeChanger={false}
            />
          </div>
        </div>
      )}

      {showCampaignModal && (
        <CreateCampaignModal
          onClose={() => setShowCampaignModal(false)}
          selectedCustomers={selectedCustomers}
          onSubmit={handleAddToRecipientsSubmit}
          loading={loading}
        />
      )}
    </div>
  )
}

export default CustomerScraper 