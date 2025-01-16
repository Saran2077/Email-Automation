import { useState, useEffect } from 'react'
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import PromptTemplateEditor from './EmailComposer/PromptTemplateEditor'

function CreateCampaignModal({ onClose, onSubmit, selectedCustomers }) {
  const navigate = useNavigate()
  const [campaignData, setCampaignData] = useState({
    name: '',
    description: '',
  })
  const [dropdownList, setDropdownList] = useState([])
  const [selectedList, setSelectedList] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPromptTemplate, setShowPromptTemplate] = useState(false)
  const [campaignTemplate, setCampaignTemplate] = useState({ subject: '', body: '' })
  const [templatePayload, setTemplatePayload] = useState(null)

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

    try {
      console.log(selectedCustomers)
      // First create recipients with template
      // const recipientsResponse = await fetch('http://localhost:3000/api/v1/recipients/bulk-create', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     recipients: selectedCustomers,
      //     template: templatePayload
      //   }),
      // })

      // if (!recipientsResponse.ok) {
      //   throw new Error('Failed to create recipients')
      // }

      const newSelectedCustomers = selectedCustomers?.map((customer) => ({...customer, email: customer?.email || `user${Math.floor(Math.random() * 10000)}@gmail.com`}))

      const newCampaignId = Object.values(newSelectedCustomers.reduce((acc, customer) => {
        const key = customer.Name;
        if (!acc[key]) {
          acc[key] = {
            Name: customer.Name,
            Description: customer.Description,
            Primary_Industry: customer.Primary_Industry,
            Business_Models: customer.Business_Models,
            Domain: customer.Domain,
            LinkedIn_URL: customer.LinkedIn_URL,
            Annual_Revenue: customer.Annual_Revenue,
            Employee_List: []
          };
        }
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

      // Then proceed with Active Campaign upload
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

      // Then call the parent's onSubmit for recipients API
      await onSubmit()

      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        const errorData = await response.json() // Attempt to parse error response
        throw new Error(errorData?.meta?.message || 'Error uploading contacts')
      }

      const responseData = await response.json() // Parse the successful response
      if (responseData.meta.status) {
        onClose()
        toast.success(responseData.meta.message)
      } else {
        throw new Error(responseData.meta.message || 'Unknown error occurred')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.message)
    } finally {
      setIsLoading(false) // Ensure loading state is reset
    }
  }

  const handleTemplateUpdate = (templateData) => {
    setTemplatePayload(JSON.parse(templateData))
    setShowPromptTemplate(false)
    toast.success('Template saved successfully!')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white w-[600px] rounded-lg shadow-xl relative">
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

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowPromptTemplate(true)}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              <SparklesIcon className="h-4 w-4" />
              <span>Generate Campaign Template with AI</span>
            </button>
          </div>

          {(campaignTemplate.subject || campaignTemplate.body) && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Generated Template</h3>
              {campaignTemplate.subject && (
                <div className="mb-2">
                  <span className="text-xs text-gray-500">Subject:</span>
                  <p className="text-sm">{campaignTemplate.subject}</p>
                </div>
              )}
              {campaignTemplate.body && (
                <div>
                  <span className="text-xs text-gray-500">Body:</span>
                  <p className="text-sm whitespace-pre-wrap">{campaignTemplate.body}</p>
                </div>
              )}
            </div>
          )}

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

      {showPromptTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="max-h-[90vh] w-[800px] overflow-y-auto bg-white rounded-lg shadow-xl">
            <PromptTemplateEditor
              onClose={() => setShowPromptTemplate(false)}
              onUpdateBody={handleTemplateUpdate}
              isBulkCampaign={true}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateCampaignModal 