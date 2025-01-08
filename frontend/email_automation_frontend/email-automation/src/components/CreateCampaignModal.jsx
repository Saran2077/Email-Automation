import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

function CreateCampaignModal({ onClose, selectedCustomersCount }) {
  const navigate = useNavigate()
  const [campaignData, setCampaignData] = useState({
    name: '',
    description: '',
  })
  const [dropdownList, setDropdownList] = useState([])
  const [selectedList, setSelectedList] = useState([])

  useEffect(() => {
    // Fetch recipients from API
    const fetchRecipients = async () => {
      const response = await fetch('http://localhost:3000/api/activeCampaign/lists')
      const data = await response.json()
      setDropdownList(data?.data) 
    }
    fetchRecipients()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newCampaignId = Date.now() 
    
    // Store campaign data or make API call here
    console.log('Campaign Data:', campaignData)
    
    // Close modal and redirect to campaign view
    onClose()
    navigate(`/campaigns/${newCampaignId}`)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white w-[600px] rounded-lg shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Upload to ActiveCampaign</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select List *
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  setSelectedList(e.target.value)
                }}
              >
                {dropdownList.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">
                Selected: {selectedCustomersCount} contacts
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCampaignModal 