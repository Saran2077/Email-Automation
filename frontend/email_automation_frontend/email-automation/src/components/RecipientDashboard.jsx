import { useState, useEffect } from 'react'
import { 
  UserGroupIcon, 
  ChartBarIcon, 
  EnvelopeIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

function RecipientDashboard() {
  const [recipients, setRecipients] = useState([])
  const [loading, setLoading] = useState(true)

  const STAGES = {
    contact: { name: 'Contact', icon: UserGroupIcon, color: 'bg-blue-100 text-blue-800' },
    lead: { name: 'Lead', icon: ChartBarIcon, color: 'bg-green-100 text-green-800' },
    deal: { name: 'Deal', icon: BriefcaseIcon, color: 'bg-purple-100 text-purple-800' },
    account: { name: 'Account', icon: EnvelopeIcon, color: 'bg-yellow-100 text-yellow-800' }
  }

  const EMAIL_METRICS = [
    { name: 'Delivered', icon: CheckCircleIcon, color: 'text-green-600', bgColor: 'bg-green-100' },
    { name: 'Opened', icon: EyeIcon, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { name: 'Clicked', icon: CursorArrowRaysIcon, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { name: 'Failed', icon: ExclamationTriangleIcon, color: 'text-red-600', bgColor: 'bg-red-100' }
  ]

  // Dummy data with email metrics
  const dummyRecipients = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      stage: 'contact',
      company: 'ABC Corp',
      lastContacted: '2024-03-20',
      emailMetrics: {
        delivered: 85,
        opened: 65,
        clicked: 45,
        failed: 5
      }
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      stage: 'lead',
      company: 'XYZ Ltd',
      lastContacted: '2024-03-25',
      emailMetrics: {
        delivered: 92,
        opened: 78,
        clicked: 56,
        failed: 2
      }
    },
    // ... other recipients
  ]

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setRecipients(dummyRecipients)
      } finally {
        setLoading(false)
      }
    }
    fetchRecipients()
  }, [])

  // Calculate overall metrics
  const overallMetrics = recipients.reduce((acc, recipient) => {
    Object.entries(recipient.emailMetrics).forEach(([key, value]) => {
      if (!acc[key]) acc[key] = 0
      acc[key] += value
    })
    return acc
  }, {})

  // Group recipients by stage
  const groupedRecipients = recipients.reduce((acc, recipient) => {
    if (!acc[recipient.stage]) acc[recipient.stage] = []
    acc[recipient.stage].push(recipient)
    return acc
  }, {})

  const handleStageChange = async (recipientId, newStage) => {
    // Update the recipient's stage in the local state
    setRecipients(prevRecipients => 
      prevRecipients.map(recipient => 
        recipient.id === recipientId 
          ? { ...recipient, stage: newStage }
          : recipient
      )
    );
    // In real app, make API call to update stage
    console.log(`Updated recipient ${recipientId} to stage: ${newStage}`);
  };

  if (loading) return <div className="p-6">Loading recipients...</div>

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Recipients Dashboard</h2>
        <p className="mt-2 text-gray-600">Manage and track your recipients across different stages</p>
      </div>

      {/* Email Metrics Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {EMAIL_METRICS.map(metric => (
          <div key={metric.name} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{metric.name} Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {overallMetrics[metric.name.toLowerCase()]}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stage-based Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {Object.entries(STAGES).map(([stage, info]) => {
          const count = groupedRecipients[stage]?.length || 0
          const Icon = info.icon
          return (
            <div key={stage} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${info.color.replace('800', '100')}`}>
                  <Icon className={`h-6 w-6 ${info.color.replace('bg-', 'text-').replace('100', '600')}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{info.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recipients List Grouped by Stage */}
      {Object.entries(STAGES).map(([stageKey, stageInfo]) => (
        groupedRecipients[stageKey]?.length > 0 && (
          <div key={stageKey} className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {stageInfo.name} Recipients
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivered Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opened Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicked Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Failed Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {groupedRecipients[stageKey].map(recipient => (
                    <tr key={recipient.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{recipient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{recipient.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{recipient.company}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-green-600">{recipient.emailMetrics.delivered}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-blue-600">{recipient.emailMetrics.opened}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-purple-600">{recipient.emailMetrics.clicked}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-red-600">{recipient.emailMetrics.failed}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={recipient.stage}
                          onChange={(e) => handleStageChange(recipient.id, e.target.value)}
                          className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-24 mr-4"
                        >
                          {/* Current stage first */}
                          <option value={recipient.stage}>
                            {STAGES[recipient.stage].name}
                          </option>
                          {/* Other stages */}
                          {Object.entries(STAGES)
                            .filter(([value]) => value !== recipient.stage)
                            .map(([value, { name }]) => (
                              <option key={value} value={value}>
                                {name}
                              </option>
                            ))}
                        </select>
                        <button className="text-blue-600 hover:text-blue-900 whitespace-nowrap">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ))}
    </div>
  )
}

export default RecipientDashboard 