import { useState } from 'react'
import { 
  InboxIcon, 
  PaperAirplaneIcon, 
  TrashIcon, 
  StarIcon as StarIconOutline,
  XMarkIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

function MailboxView() {
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [activeFolder, setActiveFolder] = useState('inbox')

  // Dummy email data
  const dummyEmails = {
    inbox: [
      {
        id: 1,
        from: 'John Doe',
        email: 'john@example.com',
        subject: 'Meeting Tomorrow',
        preview: 'Hi, I wanted to confirm our meeting tomorrow at 2 PM...',
        date: '10:30 AM',
        unread: true,
        starred: false,
      },
      {
        id: 2,
        from: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'Project Update',
        preview: 'Here are the latest updates on the project we discussed...',
        date: 'Yesterday',
        unread: false,
        starred: true,
      },
    ],
    starred: [
      {
        id: 2,
        from: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'Project Update',
        preview: 'Here are the latest updates on the project we discussed...',
        date: 'Yesterday',
        starred: true,
      },
    ],
    drafts: [
      {
        id: 3,
        to: 'alice@example.com',
        subject: 'Draft: Follow-up',
        preview: 'Regarding our last conversation...',
        date: 'Mar 15',
        isDraft: true,
      },
    ],
    sent: [
      {
        id: 3,
        to: 'Alice Johnson',
        email: 'alice@example.com',
        subject: 'Re: Product Demo',
        preview: 'Thanks for your interest. I can schedule a demo next week...',
        date: 'Mar 15',
        starred: false,
      },
    ],
    trash: [
      {
        id: 4,
        from: 'John Doe',
        email: 'john@example.com',
        subject: 'Meeting Tomorrow',
        preview: 'Hi, I wanted to confirm our meeting tomorrow at 2 PM...',
        date: '10:30 AM',
        unread: true,
        starred: false,
      },
      {
        id: 5,
        from: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'Project Update',
        preview: 'Here are the latest updates on the project we discussed...',
        date: 'Yesterday',
        unread: false,
        starred: true,
      },
    ],
  }

  const folders = [
    { name: 'Inbox', icon: InboxIcon, id: 'inbox', count: dummyEmails.inbox.length },
    { name: 'Starred', icon: StarIconSolid, id: 'starred', count: dummyEmails.starred.length },
    { name: 'Drafts', icon: DocumentTextIcon, id: 'drafts', count: dummyEmails.drafts.length },
    { name: 'Sent', icon: PaperAirplaneIcon, id: 'sent' },
    { name: 'Trash', icon: TrashIcon, id: 'trash' },
  ]

  const toggleStar = (emailId) => {
    // Implementation for toggling star
    console.log('Toggle star for email:', emailId)
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 border-r bg-white shadow-sm">
        <div className="p-4">
          <button className="w-full bg-blue-600 text-white rounded-full px-4 py-2.5 hover:bg-blue-700 transition-colors font-medium text-sm">
            Compose
          </button>
        </div>
        <nav className="mt-2">
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setActiveFolder(folder.id)}
              className={`w-full flex items-center justify-between px-6 py-2.5 text-sm ${
                activeFolder === folder.id
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <folder.icon className="h-4 w-4 mr-3" />
                {folder.name}
              </div>
              {folder.count > 0 && (
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                  {folder.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Email List */}
      <div className="flex-1 bg-white">
        <div className="h-14 border-b flex items-center px-4 bg-white sticky top-0">
          <input 
            type="text"
            placeholder="Search emails..."
            className="w-full px-3 py-1.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>
        <div className="overflow-auto h-[calc(100vh-3.5rem)]">
          {(dummyEmails[activeFolder] || []).map((email) => (
            <div
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={`flex items-center px-6 py-3 border-b cursor-pointer ${
                email.unread ? 'font-medium bg-blue-50' : ''
              } hover:bg-gray-50 transition-colors`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleStar(email.id)
                }}
                className="mr-4 flex-shrink-0"
              >
                {email.starred ? (
                  <StarIconSolid className="h-4 w-4 text-yellow-400" />
                ) : (
                  <StarIconOutline className="h-4 w-4 text-gray-400" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="block truncate text-sm">
                    {activeFolder === 'sent' ? `To: ${email.to}` : email.from}
                  </span>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{email.date}</span>
                </div>
                <div className="text-sm text-gray-900 font-medium truncate">{email.subject}</div>
                <p className="text-sm text-gray-500 truncate">{email.preview}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white w-[800px] max-h-[80vh] rounded-lg shadow-xl flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">{selectedEmail.subject}</h2>
              <button 
                onClick={() => setSelectedEmail(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-medium text-lg">
                      {activeFolder === 'sent' ? `To: ${selectedEmail.to}` : `From: ${selectedEmail.from}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {`<${selectedEmail.email}>`}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{selectedEmail.date}</div>
                </div>
                <div className="prose max-w-none">
                  {selectedEmail.preview}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t p-4 flex justify-end space-x-2">
              <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                Reply
              </button>
              <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                Forward
              </button>
              <button className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MailboxView 