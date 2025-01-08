import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function CreateCampaignModal({ onClose, selectedCustomers }) {
  const navigate = useNavigate()
  const [campaignData, setCampaignData] = useState({
    name: '',
    description: '',
  })
  const [dropdownList, setDropdownList] = useState([])
  const [selectedList, setSelectedList] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Fetch recipients from API
    const fetchRecipients = async () => {
      const response = await fetch('http://localhost:3000/api/activeCampaign/lists')
      const data = await response.json()
      setDropdownList(data?.data) 
    }
    fetchRecipients()
  }, [])

  const handleSubmit = async(e) => {
    e.preventDefault()
    setIsLoading(true)
    console.log(selectedCustomers, "asdasd")
    const newCampaignId = Object.values(selectedCustomers.reduce((acc, customer) => {
      // Create a unique key for each company based on the company name
      const key = customer.Name;

      // If the company doesn't exist in the accumulator, create a new entry
      if (!acc[key]) {
        acc[key] = {
          Name: customer.Name,
          Description: customer.Description,
          Primary_Industry: customer.Primary_Industry,
          Business_Models: customer.Business_Models,
          Domain: customer.Domain,
          LinkedIn_URL: customer.LinkedIn_URL,
          Annual_Revenue: customer.Annual_Revenue,
          Employee_List: [] // Initialize Employee_List as an empty array
        };
      }

      // Push the employee details into the Employee_List
      acc[key].Employee_List.push({
        designation: customer.designation,
        id: customer.id,
        name: customer.name,
        profileLinks: customer.profileLinks,
        shortBio: customer.shortBio,
        isKeyPeople: customer.isKeyPeople,
        isFoundingMember: customer.isFoundingMember,
        tracxnId: customer.tracxnId
      });

      return acc;
    }, {}))
    console.log(newCampaignId)

    try {
      const response = await fetch('http://localhost:3000/api/activeCampaign/contact/bulk-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          list_id: selectedList,
          data: newCampaignId
        }),
      })

      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        const errorData = await response.json(); // Attempt to parse error response
        throw new Error(errorData?.meta?.message || 'Error uploading contacts');
      }

      const responseData = await response.json(); // Parse the successful response
      if (responseData.meta.status) {
        onClose()
        toast.success(responseData.meta.message)
      } else {
        throw new Error(responseData.meta.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error uploading contacts:', error.message)
      toast.error(`Error uploading contacts: ${error.message}`)
    } finally {
      setIsLoading(false) // Ensure loading state is reset
    }
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
                Selected: {selectedCustomers?.length} contacts
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
              disabled={selectedList === null || isLoading}
            >
              {isLoading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCampaignModal 