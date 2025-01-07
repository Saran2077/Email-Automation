import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { 
  UserGroupIcon, 
  CalendarIcon, 
  ChartBarIcon,
  EnvelopeIcon 
} from '@heroicons/react/24/outline'

const STAGES = {
  contact: { name: 'Contact', color: 'gray' },
  lead: { name: 'Lead', color: 'blue' },
  deal: { name: 'Deal', color: 'green' },
  account: { name: 'Account', color: 'purple' }
}

function CampaignView() {
  const { id } = useParams()
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [groupedRecipients, setGroupedRecipients] = useState({})

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCampaign({
        id,
        name: 'Welcome Campaign',
        description: 'Initial welcome message for new customers',
        subject: 'Welcome to our service!',
        status: 'Active',
        scheduledDate: '2024-03-25T10:00',
        stats: {
          recipients: 150,
          opened: 75,
          clicked: 45,
          bounced: 2
        },
        recipients: [
          { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Sent', stage: 'contact' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Opened', stage: 'lead' },
          { id: 3, name: 'Alice Brown', email: 'alice@example.com', status: 'Sent', stage: 'deal' },
          { id: 4, name: 'Bob Wilson', email: 'bob@example.com', status: 'Opened', stage: 'contact' },
        ]
      })
      setLoading(false)
    }, 1000)
  }, [id])

  useEffect(() => {
    if (campaign) {
      // Group recipients by stage
      const grouped = campaign.recipients.reduce((acc, recipient) => {
        if (!acc[recipient.stage]) {
          acc[recipient.stage] = []
        }
        acc[recipient.stage].push(recipient)
        return acc
      }, {})
      setGroupedRecipients(grouped)
    }
  }, [campaign])

  const handleStageChange = (recipientId, newStage) => {
    if (!campaign) return

    // Update the recipient's stage
    const updatedRecipients = campaign.recipients.map(recipient => {
      if (recipient.id === recipientId) {
        return { ...recipient, stage: newStage }
      }
      return recipient
    })

    // Update campaign with new recipients
    setCampaign(prev => ({
      ...prev,
      recipients: updatedRecipients
    }))
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!campaign) {
    return <div className="p-6">Campaign not found</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">{campaign.name}</h2>
        <p className="text-gray-600 mt-1">{campaign.description}</p>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Recipients</p>
              <p className="text-xl font-semibold">{campaign.stats.recipients}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <EnvelopeIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Opened</p>
              <p className="text-xl font-semibold">{campaign.stats.opened}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Clicked</p>
              <p className="text-xl font-semibold">{campaign.stats.clicked}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-sm font-semibold">
                {new Date(campaign.scheduledDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Details */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium">Campaign Details</h3>
        </div>
        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Email Subject</p>
            <p className="font-medium">{campaign.subject}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Frequency</p>
            <p className="font-medium capitalize">{campaign.frequency}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <span className={`px-2 py-1 text-sm font-semibold rounded-full 
              ${campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {campaign.status}
            </span>
          </div>
        </div>
      </div>

      {/* Recipients by Stage */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Recipients by Stage</h3>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {Object.entries(STAGES).map(([stageKey, stageInfo]) => (
            <div 
              key={stageKey}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className={`text-${stageInfo.color}-600 font-medium mb-2`}>
                {stageInfo.name}
              </div>
              <div className="text-2xl font-semibold">
                {groupedRecipients[stageKey]?.length || 0}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipients List Grouped by Stage */}
      {Object.entries(STAGES).map(([stageKey, stageInfo]) => (
        groupedRecipients[stageKey]?.length > 0 && (
          <div key={stageKey} className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium">
                {stageInfo.name} Recipients
              </h3>
            </div>
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {groupedRecipients[stageKey].map(recipient => (
                  <tr key={recipient.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{recipient.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{recipient.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${recipient.status === 'Opened' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {recipient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={recipient.stage}
                        onChange={(e) => handleStageChange(recipient.id, e.target.value)}
                        className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Object.entries(STAGES).map(([key, { name }]) => (
                          <option key={key} value={key}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ))}
    </div>
  )
}

export default CampaignView 