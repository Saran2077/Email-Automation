import { useState, useEffect } from 'react'
import { recipientAPI } from '../utils/apiLayer'

function RecipientDashboard() {
  const [recipients, setRecipients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRecipients()
  }, [])

  const fetchRecipients = async () => {
    try {
      setLoading(true)
      const response = await recipientAPI.list()
      setRecipients(response.recipients || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching recipients:', err)
      setError('Failed to load recipients')
      setRecipients([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Recipients</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recipients.map((recipient) => (
              <tr key={recipient._id}>
                <td className="px-6 py-4 whitespace-nowrap">{recipient.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{recipient.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{recipient.company}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {recipient.stage}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecipientDashboard 