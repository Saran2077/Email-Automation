import { useState, useEffect } from 'react'
import Draggable from 'react-draggable'
import { 
  InboxIcon, 
  PaperAirplaneIcon, 
  TrashIcon, 
  StarIcon as StarIconOutline,
  XMarkIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  MinusIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { mailboxAPI } from '../utils/apiLayer'

function MailboxView() {
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [activeFolder, setActiveFolder] = useState('inbox')
  const [emails, setEmails] = useState({
    inbox: [],
    starred: [],
    drafts: [],
    sent: [],
    trash: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [minimizedEmails, setMinimizedEmails] = useState([])
  const [isMinimized, setIsMinimized] = useState(false)

  // Fetch all emails on initial load
  useEffect(() => {
    fetchDraftEmails();
  }, []); // Empty dependency array means this runs once on mount

  const fetchDraftEmails = async () => {
    try {
      setLoading(true);
      const response = await mailboxAPI.listDrafts();
      
      // Transform the API response to match our email format
      const draftEmails = response.data.data.drafts.map(draft => ({
        id: draft.emailId,
        subject: draft.subject,
        preview: draft.body,
        to: draft.to.email,
        from: draft.from,
        date: new Date(draft.createdAt).toLocaleDateString(),
        isDraft: true,
        starred: draft.isStarred
      }));

      setEmails(prev => ({
        ...prev,
        drafts: draftEmails
      }));
    } catch (err) {
      setError('Failed to fetch draft emails');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const folders = [
    { name: 'Inbox', icon: InboxIcon, id: 'inbox', count: emails.inbox.length },
    { name: 'Starred', icon: StarIconSolid, id: 'starred', count: emails.starred.length },
    { name: 'Drafts', icon: DocumentTextIcon, id: 'drafts', count: emails.drafts.length },
    { name: 'Sent', icon: PaperAirplaneIcon, id: 'sent', count: emails.sent.length },
    { name: 'Trash', icon: TrashIcon, id: 'trash', count: emails.trash.length },
  ]

  const toggleStar = (emailId) => {
    // Implementation for toggling star
    console.log('Toggle star for email:', emailId)
  }

  const handleMinimize = (email) => {
    setIsMinimized(true)
    if (!minimizedEmails.find(e => e.id === email.id)) {
      setMinimizedEmails(prev => [...prev, email])
    }
    setSelectedEmail(null)
  }

  const handleMaximize = (email) => {
    setMinimizedEmails(prev => prev.filter(e => e.id !== email.id))
    setSelectedEmail(email)
    setIsMinimized(false)
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
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                  {folder.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Email List */}
      <div className="flex-1 bg-white">
        <div className="h-14 border-b flex items-center justify-between px-4 bg-white sticky top-0">
          <input 
            type="text"
            placeholder="Search emails..."
            className="w-full px-3 py-1.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white mr-4"
          />
          {activeFolder === 'drafts' && (
            <button 
              onClick={fetchDraftEmails}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              title="Refresh drafts"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading emails...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="overflow-auto h-[calc(100vh-3.5rem)]">
            {(emails[activeFolder] || []).map((email) => (
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
        )}
      </div>

      {/* Gmail-style Draft Email Modal */}
      {selectedEmail && activeFolder === 'drafts' && (
        <Draggable handle=".modal-handle" bounds="body">
          <div className="fixed bottom-0 right-24 w-[600px] bg-white rounded-t-lg shadow-xl z-50 flex flex-col">
            {/* Modal Header */}
            <div className="modal-handle flex items-center justify-between px-4 py-2 bg-gray-100 rounded-t-lg cursor-move">
              <h3 className="text-sm font-medium text-gray-700">Edit Draft</h3>
              <div className="flex items-center space-x-2">
                <button 
                  className="p-1.5 hover:bg-gray-200 rounded-full"
                  title="Minimize"
                  onClick={() => handleMinimize(selectedEmail)}
                >
                  <MinusIcon className="h-4 w-4 text-gray-600" />
                </button>
                <button 
                  className="p-1.5 hover:bg-gray-200 rounded-full"
                  title="Full Screen"
                >
                  <ArrowsPointingOutIcon className="h-4 w-4 text-gray-600" />
                </button>
                <button 
                  onClick={() => setSelectedEmail(null)}
                  className="p-1.5 hover:bg-gray-200 rounded-full"
                  title="Close"
                >
                  <XMarkIcon className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Email Form */}
            <div className="flex-1 p-4">
              {/* Recipients */}
              <div className="flex items-center border-b py-2">
                <span className="text-sm text-gray-600 w-12">To</span>
                <input 
                  type="text" 
                  value={selectedEmail.to}
                  className="flex-1 outline-none text-sm"
                  readOnly
                />
                <button className="text-gray-400 hover:text-gray-600">
                  Cc
                </button>
              </div>

              {/* Subject */}
              <div className="flex items-center border-b py-2">
                <input 
                  type="text"
                  value={selectedEmail.subject}
                  placeholder="Subject"
                  className="flex-1 outline-none text-sm"
                  readOnly
                />
              </div>

              {/* Body */}
              <div className="mt-4 h-[300px]">
                <textarea 
                  className="w-full h-full outline-none text-sm resize-none"
                  value={selectedEmail.preview}
                  readOnly
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t flex items-center justify-between">
              <div>
                <button 
                  className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    // TODO: Implement send functionality
                    console.log('Sending draft:', selectedEmail.id);
                  }}
                >
                  Send
                </button>
              </div>
              
              {/* Formatting Tools */}
              <div className="flex items-center space-x-2 text-gray-600">
                <button className="p-2 hover:bg-gray-100 rounded" title="Formatting options">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded" title="Attach files">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Draggable>
      )}

      {/* Minimized Emails Bar */}
      {minimizedEmails.length > 0 && (
        <div className="fixed bottom-0 right-0 flex space-x-2 p-2 z-50">
          {minimizedEmails.map(email => (
            <div
              key={email.id}
              className="bg-white shadow-lg rounded-t-lg w-64 cursor-pointer hover:bg-gray-50"
              onClick={() => handleMaximize(email)}
            >
              <div className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-t-lg">
                <span className="text-sm font-medium truncate">
                  {email.subject}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    setMinimizedEmails(prev => 
                      prev.filter(e => e.id !== email.id)
                    )
                  }}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <XMarkIcon className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MailboxView 