import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

function AddToRecipientsModal({ onClose, selectedCustomersCount }) {
  const [initialStage, setInitialStage] = useState('contact')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate API call to add customers to recipients
    console.log('Adding customers as recipients with stage:', initialStage)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white w-[600px] rounded-lg shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Add to Recipients</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Stage
              </label>
              <select
                value={initialStage}
                onChange={(e) => setInitialStage(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="contact">Contact</option>
                <option value="lead">Lead</option>
                <option value="deal">Deal</option>
                <option value="account">Account</option>
              </select>
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">
                Selected Customers: {selectedCustomersCount}
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
              Add to Recipients
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddToRecipientsModal 