import { useState, useEffect } from 'react'
import { recipientAPI, dashboardAPI } from '../utils/apiLayer'
import EmailStatsDashboard from './EmailStatsDashboard'
import { Pagination, Select, Input } from 'antd'
import { IconButton } from '@mui/material'
import { EyeIcon, Filter, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function RecipientDashboard() {
  const [recipients, setRecipients] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [dashboardMetricsLoading, setDashboardMetricsLoading] = useState(true)
  const [dashboardMetrics, setDashboardMetrics] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    stage: 'all'
  })

  const stages = [
    'Contact', 'Lead', 'Deal', 'Account'
  ]

  useEffect(() => {
    fetchDashboardMetrics()
  }, [])

  useEffect(() => {
    fetchRecipients()
  }, [currentPage, filters])

  const getEngagementColor = (level) => {
    switch (level) {
      case 'cold':
        return 'bg-blue-100 text-blue-800';
      case 'warm':
        return 'bg-yellow-100 text-yellow-800';
      case 'hot':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const fetchRecipients = async () => {
    try {
      setLoading(true)
      const response = await recipientAPI.list({ 
        page: currentPage,
        search: filters.search,
        stage: filters.stage === 'all' ? undefined : filters.stage
      })
      setRecipients(response || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching recipients:', err)
      setError('Failed to load recipients')
      setRecipients([])
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboardMetrics = async () => {
    try {
      setDashboardMetricsLoading(true)
      const response = await dashboardAPI.metrics()
      setDashboardMetrics(response.data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching recipients:', err)
      setError('Failed to load recipients')
      setRecipients([])
    } finally {
      setDashboardMetricsLoading(false)
    }
  }

  const handleStageChange = async (recipientData, newStage) => {
    try {
      await recipientAPI.updateStage(recipientData?._id, { stage: newStage, email: recipientData?.email })
      setRecipients((prevRecipients) =>
        prevRecipients.map((recipient) =>
          recipient._id === recipientData?._id ? { ...recipient, stage: newStage } : recipient
        )
      )
    } catch (err) {
      console.error('Error updating stage:', err)
      setError('Failed to update stage')
    }
  }

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }))
    setCurrentPage(1)
  }

  const handleStageFilter = (value) => {
    setFilters(prev => ({ ...prev, stage: value }))
    setCurrentPage(1)
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>
  }

  return (
    <div className="p-6">
      {!dashboardMetricsLoading && <EmailStatsDashboard stats={dashboardMetrics} />}
      
      <div className="mb-8 mt-6">
        <h2 className="text-2xl font-semibold text-gray-800">Recipients</h2>
        <p className="text-sm text-gray-500 mt-1">Manage and track your recipient list</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Filter size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Filters</span>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by name, email, or company..."
              className="pl-10 h-10 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Stage Filter */}
          <div className="min-w-[200px]">
            <Select
              className="w-full"
              placeholder="Filter by stage"
              value={filters.stage}
              onChange={handleStageFilter}
              suffixIcon={<Filter size={14} />}
            >
              <Select.Option value="all">
                <div className="flex items-center gap-2">
                  <span>All Stages</span>
                </div>
              </Select.Option>
              {stages.map((stage) => (
                <Select.Option key={stage} value={stage}>
                  <div className="flex items-center gap-2">
                    <span>{stage}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Clear Filters Button - Only show if filters are active */}
          {(filters.search || filters.stage !== 'all') && (
            <button
              onClick={() => {
                setFilters({ search: '', stage: 'all' });
                setCurrentPage(1);
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {(filters.search || filters.stage !== 'all') && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Active filters:</span>
            {filters.search && (
              <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                Search: {filters.search}
              </span>
            )}
            {filters.stage !== 'all' && (
              <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                Stage: {filters.stage}
              </span>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-6">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recipients?.recipients.map((recipient) => (
                <tr key={recipient._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{recipient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{recipient.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{recipient.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Select 
                      className="px-2 py-1 text-xs font-semibold rounded-full w-36"
                      value={recipient?.stage} 
                      onChange={(newStage) => handleStageChange(recipient, newStage)}
                    >
                      {stages.map((stage) => (
                        <Select.Option key={stage} value={stage}>{stage}</Select.Option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${getEngagementColor(recipient?.engagement_level)}`}>
                      {recipient?.engagement_level || 'Unknown'}
                    </span>
                  </td>
                  <td>
                    <IconButton onClick={() => navigate(`/contactView/${recipient?.recipientId}`)}>
                      <EyeIcon size={20} />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='flex justify-center pb-5'>
            <Pagination
              current={currentPage}
              onChange={setCurrentPage}
              total={recipients?.total}
              pageSize={10}
              showSizeChanger={false}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default RecipientDashboard