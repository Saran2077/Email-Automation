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
  ArrowsPointingOutIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { mailboxAPI } from '../utils/apiLayer'
import { toast } from 'react-toastify'
import EmailComposerModal from './EmailComposer/EmailComposerModal'
import { promptAPI } from '../utils/apiLayer'
import { useLocation, useNavigate } from 'react-router-dom'

function MailboxView() {
  const navigate = useNavigate();
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [activeFolder, setActiveFolder] = useState('inbox')
  const [emails, setEmails] = useState({
    inbox: [],
    starred: [],
    drafts: [],
    sent: [],
    trash: []
  })
  const [loading, setLoading] = useState(false)
  const location = useLocation();
  const [error, setError] = useState(null)
  const [minimizedEmails, setMinimizedEmails] = useState([])
  const [isMinimized, setIsMinimized] = useState(false)
  const [editedEmail, setEditedEmail] = useState(null)
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [newEmail, setNewEmail] = useState({
    to: '',
    subject: '',
    body: ''
  })
  const [formErrors, setFormErrors] = useState({
    to: '',
    subject: '',
    body: ''
  });
  const [showEmail, setShowEmail] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');

  // Fetch all emails on initial load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Fetch both draft and sent emails in parallel
        await Promise.all([
          fetchDraftEmails(),
          fetchSentEmails(),
          fetchInboxEmails(),
          fetchStarEmails(),
        ]);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError('Failed to fetch emails');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (location.state) {
      const { subject, originalEmail, body, isForward, to } = location.state;
      setNewEmail({
        subject,
        body,
        to: to || ""
      })
      setShowComposeModal(true)
    }
  }, [location.state])

  // Initialize edited email when a draft is selected
  useEffect(() => {
    if (selectedEmail && activeFolder === 'drafts') {
      setEditedEmail({
        id: selectedEmail.id,
        subject: selectedEmail.subject,
        to: selectedEmail.to,
        body: selectedEmail.preview
      });
    } else if (selectedEmail) {
      navigate(`/emailView/${selectedEmail.id}`);
    }
  }, [selectedEmail]);

  useEffect(() => {
    if (location.state?.draftEmail) {
      const draftEmail = location.state.draftEmail;
      setSelectedEmail(draftEmail);
      setEditedEmail(draftEmail);
      setActiveFolder('drafts');
      setShowComposeModal(false);
    } else if (!location.state?.suppressComposeModal) {
      setShowComposeModal(true);
    }
  }, [location.state]);

  const fetchDraftEmails = async (showToast = false) => {
    try {
      setLoading(true);
      const response = await mailboxAPI.listDrafts();
      
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

      // Only show toast if explicitly requested
      if (showToast) {
        toast.success('Draft saved successfully!');
      }

    } catch (err) {
      setError('Failed to fetch draft emails');
      if (showToast) {
        toast.error('Failed to fetch draft emails');
      }
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInboxEmails = async (showToast = false) => {
    try {
      setLoading(true);
      const response = await mailboxAPI.inboxEmails();
      
      const inboxEmails = response.data.data.inbox.map(draft => ({
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
        inbox: inboxEmails
      }));

      // Only show toast if explicitly requested
      if (showToast) {
        toast.success('Draft saved successfully!');
      }

    } catch (err) {
      setError('Failed to fetch draft emails');
      if (showToast) {
        toast.error('Failed to fetch draft emails');
      }
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSentEmails = async (showToast = false) => {
    try {
      setLoading(true);
      const response = await mailboxAPI.listSentEmails();
      
      const sentEmails = response.data.data.sent.map(sent => ({
        id: sent.emailId,
        subject: sent.subject,
        preview: sent.body,
        to: sent.to.email,
        from: sent.from,
        date: new Date(sent.createdAt).toLocaleDateString(),
        isSent: true,
        starred: sent.isStarred
      }));

      setEmails(prev => ({
        ...prev,
        sent: sentEmails
      }));

      // Only show toast if explicitly requested
      if (showToast) {
        toast.success('Email sent successfully!');
      }

    } catch (err) {
      setError('Failed to fetch sent emails');
      if (showToast) {
        toast.error('Failed to fetch sent emails');
      }
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStarEmails = async (showToast = false) => {
    try {
      setLoading(true);
      const response = await mailboxAPI.listStarredEmails();
      
      const sentEmails = response.data.data.starred.map(sent => ({
        id: sent.emailId,
        subject: sent.subject,
        preview: sent.body,
        to: sent.to.email,
        from: sent.from,
        date: new Date(sent.createdAt).toLocaleDateString(),
        isSent: true,
        starred: sent.isStarred
      }));

      setEmails(prev => ({
        ...prev,
        starred: sentEmails
      }));

      // Only show toast if explicitly requested
      if (showToast) {
        toast.success('Email sent successfully!');
      }

    } catch (err) {
      setError('Failed to fetch sent emails');
      if (showToast) {
        toast.error('Failed to fetch sent emails');
      }
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

  const toggleStar = async (email) => {
    setIsUpdating(true);
    try {
      const { id, starred } = email;
      const response = await mailboxAPI.updateStarEmails(id)

      if (response?.success) {
        // await fetchInboxEmails();
        setEmails((prev) => ({
          ...prev,
          [activeFolder]: prev[activeFolder].map(e => e.id === id ? {...e, starred:!starred } : e)
        }))

        console.log("Emails: ", emails)
        await fetchStarEmails();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
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

  const handleInputChange = (field, value) => {
    setEditedEmail(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveDraft = async () => {
    // Reset previous errors
    setFormErrors({
      to: '',
      subject: '',
      body: ''
    });

    // For drafts, we'll only validate if fields are filled - if they are, they should be valid
    let hasErrors = false;
    const errors = {
      to: '',
      subject: '',
      body: ''
    };

    // Only validate email format if an email is provided
    if (editedEmail.to.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedEmail.to.trim())) {
      errors.to = 'Please enter a valid email address';
      hasErrors = true;
    }

    // At least one field should have content to save as draft
    if (!editedEmail.to.trim() && !editedEmail.subject.trim() && !editedEmail.body.trim()) {
      errors.body = 'Please enter some content before saving as draft';
      hasErrors = true;
    }

    if (hasErrors) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      
      const draftData = {
        emailId: editedEmail.id,
        subject: editedEmail.subject,
        body: editedEmail.body,
        to: editedEmail.to,
      };

      const response = await mailboxAPI.updateDraft(draftData);
      
      if (response.success) {
        toast.success('Draft saved successfully!');
        // Update local state and continue...
      } else {
        throw new Error('Failed to save draft');
      }
      
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendDraft = async (email) => {
    // Reset previous errors
    setFormErrors({
      to: '',
      subject: '',
      body: ''
    });

    // Validate fields
    let hasErrors = false;
    const errors = {
      to: '',
      subject: '',
      body: ''
    };

    if (!email.to.trim()) {
      errors.to = 'Recipient email is required';
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.to.trim())) {
      errors.to = 'Please enter a valid email address';
      hasErrors = true;
    }

    if (!email.subject.trim()) {
      errors.subject = 'Subject is required';
      hasErrors = true;
    }

    if (!email.body.trim()) {
      errors.body = 'Email body is required';
      hasErrors = true;
    }

    if (hasErrors) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      
      const emailData = {
        emailId: email.id,
        subject: email.subject,
        body: plainTextToHtml(email.body),
        to: email.to,
        from: "betagamer580@gmail.com"
      };

      const response = await mailboxAPI.sendEmail(emailData);
      
      if (response.success) {
        toast.success('Email sent successfully!');
        setSelectedEmail(null);
        await fetchSentEmails();
        setEmails((prev) => ({
          ...prev,
          [activeFolder]: prev[activeFolder].filter(e => e.id !== email?.id)
        }))
        
      } else {
        throw new Error('Failed to send email');
      }
      
    } catch (error) {
      console.error('Failed to send email:', error);
      toast.error('Failed to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const htmlToPlainText = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  // Convert plain text back to HTML (in this case, keeping it simple)
  const plainTextToHtml = (text) => {
    return text
      .split("\n")
      .map((line) => `<p>${line}</p>`)
      .join(""); // Wrap each line in <p> tags
  };

  const handleComposeEmail = async () => {
    // Reset previous errors
    setFormErrors({
      to: '',
      subject: '',
      body: ''
    });

    // Validate fields
    let hasErrors = false;
    const errors = {
      to: '',
      subject: '',
      body: ''
    };

    if (!newEmail.to.trim()) {
      errors.to = 'Recipient email is required';
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.to.trim())) {
      errors.to = 'Please enter a valid email address';
      hasErrors = true;
    }

    if (!newEmail.subject.trim()) {
      errors.subject = 'Subject is required';
      hasErrors = true;
    }

    if (!newEmail.body.trim()) {
      errors.body = 'Email body is required';
      hasErrors = true;
    }

    if (hasErrors) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      
      const emailData = {
        subject: newEmail.subject,
        body: plainTextToHtml(newEmail.body),
        to: newEmail.to,
        from: "betagamer580@gmail.com"
      };

      const response = await mailboxAPI.sendEmail(emailData);
      
      if (response.success) {
        toast.success('Email sent successfully!');
        setShowComposeModal(false);
        setNewEmail({ to: '', subject: '', body: '' });
        
        // Refresh the sent emails list
        await fetchSentEmails();
      } else {
        throw new Error('Failed to send email');
      }
      
    } catch (error) {
      console.error('Failed to send email:', error);
      toast.error('Failed to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleComposeInputChange = (field, value) => {
    setNewEmail(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAsDraft = async () => {
    // Reset previous errors
    setFormErrors({
      to: '',
      subject: '',
      body: ''
    });

    // For drafts, we'll only validate if fields are filled - if they are, they should be valid
    let hasErrors = false;
    const errors = {
      to: '',
      subject: '',
      body: ''
    };
    
    // Only validate email format if an email is provided
    if (!newEmail.to.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.to.trim())) {
      errors.to = 'Please enter a valid email address';
      hasErrors = true;
    }

    // At least one field should have content to save as draft
    if (!newEmail.to.trim() && !newEmail.subject.trim() && !newEmail.body.trim()) {
      errors.body = 'Please enter some content before saving as draft';
      hasErrors = true;
    }

    if (hasErrors) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      
      const draftData = {
        subject: newEmail.subject,
        body: newEmail.body,
        to: newEmail.to,
        from: "postmaster@sandboxed091eb00b0a47fa91a3c0113be24b39.mailgun.org"
      };

      const response = await mailboxAPI.createDraft(draftData);
      
      if (response.success) {
        toast.success('Draft saved successfully!');
        setShowComposeModal(false);
        setNewEmail({ to: '', subject: '', body: '' });
        
        // Refresh the drafts list
        await fetchDraftEmails();
      } else {
        throw new Error('Failed to save draft');
      }
      
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast.error('Failed to save draft. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
        toast.error('Please enter a prompt for the AI');
        return;
    }

    try {
        setLoading(true);
        
        // Get the recipient email based on current mode
        const toEmail = showComposeModal ? newEmail.to : editedEmail.to;
        
        // Prepare custom context with AI prompt
        const customContext = {
            aiPrompt: aiPrompt,
            // You can add more context here if needed
        };

        // Make the API call using promptAPI
        const response = await promptAPI.generateEmail(toEmail, customContext);
        
        if (response?.data) {
            const { subject, body } = response.data;

            // Update the email content based on whether we're in compose or edit mode
            if (showComposeModal) {
                setNewEmail(prev => ({
                    ...prev,
                    subject,
                    body
                }));
            } else if (editedEmail) {
                setEditedEmail(prev => ({
                    ...prev,
                    subject,
                    body
                }));
            }

            setShowAIPrompt(false);
            setAIPrompt('');
            toast.success('Email content generated successfully!');
        } else {
            throw new Error('Invalid response format from AI service');
        }
    } catch (error) {
        console.error('Error generating AI content:', error);
        toast.error('Failed to generate AI content. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-72 bg-white shadow-lg">
        <div className="p-6">
          <button 
            onClick={() => setShowComposeModal(true)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg px-6 py-3 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Compose
          </button>
        </div>
        <nav className="mt-4 px-3">
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setActiveFolder(folder.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-1 transition-all duration-200 ${
                activeFolder === folder.id
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-medium shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <folder.icon className={`h-5 w-5 mr-3 ${
                  activeFolder === folder.id ? 'text-indigo-600' : 'text-gray-400'
                }`} />
                <span className="text-sm">{folder.name}</span>
              </div>
              {folder.count > 0 && (
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  activeFolder === folder.id 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {folder.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Email List */}
      <div className="flex-1 bg-white ml-1 shadow-lg">
        <div className="h-16 border-b flex items-center justify-between px-6 bg-white sticky top-0 z-10">
          <div className="relative flex-1 max-w-2xl">
            <input 
              type="text"
              placeholder="Search emails..."
              className="w-full px-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white border border-gray-200 pl-10"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {(activeFolder === 'drafts' || activeFolder === 'sent') && (
            <button 
              className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 ml-4 transition-colors"
              title={`Refresh ${activeFolder}`}
              onClick={() => activeFolder === 'drafts' ? fetchDraftEmails(true) : fetchSentEmails(true)}
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="overflow-auto h-[calc(100vh-4rem)]">
          {(emails[activeFolder] || []).map((email) => (
            <div
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={`flex items-center px-6 py-4 border-b cursor-pointer ${
                email.unread ? 'bg-indigo-50' : 'hover:bg-gray-50'
              } transition-all duration-200`}
            >
              <button
                className="mr-4 flex-shrink-0 transition-transform hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleStar(email)
                }}
              >
                {email.starred ? (
                  <StarIconSolid className="h-5 w-5 text-yellow-400" />
                ) : (
                  <StarIconOutline className="h-5 w-5 text-gray-400" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {activeFolder === 'sent' ? `To: ${email.to}` : email.from}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">{email.date}</span>
                </div>
                <div className="text-sm text-gray-800 font-medium line-clamp-1">{email.subject}</div>
                <p className="text-sm text-gray-500 line-clamp-1">{email.preview}</p>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Updated Draft Email Modal */}
      {selectedEmail && activeFolder === 'drafts' && editedEmail && (
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
              <div className="border-b">
                <div className="flex items-center py-2">
                  <span className="text-sm text-gray-600 w-12">To</span>
                  <input 
                    type="email" 
                    value={editedEmail.to}
                    onChange={(e) => {
                      handleInputChange('to', e.target.value);
                      if (formErrors.to) {
                        setFormErrors(prev => ({ ...prev, to: '' }));
                      }
                    }}
                    className="flex-1 outline-none text-sm"
                    placeholder="recipient@example.com"
                  />
                </div>
                {formErrors.to && (
                  <div className="text-red-500 text-sm pb-2">{formErrors.to}</div>
                )}
              </div>

              {/* Subject */}
              <div className="border-b">
                <div className="flex items-center py-2">
                  <input 
                    type="text"
                    value={editedEmail.subject}
                    onChange={(e) => {
                      handleInputChange('subject', e.target.value);
                      if (formErrors.subject) {
                        setFormErrors(prev => ({ ...prev, subject: '' }));
                      }
                    }}
                    placeholder="Subject"
                    className="flex-1 outline-none text-sm"
                  />
                </div>
                {formErrors.subject && (
                  <div className="text-red-500 text-sm pb-2">{formErrors.subject}</div>
                )}
              </div>

              {/* Body */}
              <div className="mt-4 flex flex-col h-[300px] relative">
                <textarea 
                  className="w-full h-full outline-none text-sm resize-none p-2"
                  value={editedEmail.body}
                  onChange={(e) => {
                    handleInputChange('body', e.target.value);
                    if (formErrors.body) {
                      setFormErrors(prev => ({ ...prev, body: '' }));
                    }
                  }}
                  placeholder="Write your email..."
                />
                {formErrors.body && (
                  <div className="text-red-500 text-sm mt-2">{formErrors.body}</div>
                )}

                <EmailComposerModal 
                  recipientEmail={editedEmail.to}
                  onUpdateBody={(newBody) => handleInputChange('body', newBody)}
                  onUpdateSubject={(newSubject) => handleInputChange('subject', newSubject)}
                />

              </div>
               
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t flex items-center justify-between">
              <div className="flex space-x-2">
                <button 
                  className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  onClick={() => handleSendDraft(editedEmail)}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
                <button 
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                  onClick={handleSaveDraft}
                  disabled={loading}
                >
                  Save Draft
                </button>
              </div>
              
              {/* Formatting Tools */}
              <div className="flex items-center space-x-2 text-gray-600">
                <button 
                  className={`p-2 rounded ${
                      editedEmail?.to ? 'hover:bg-gray-100 text-gray-600' : 'text-gray-300 cursor-not-allowed'
                  }`}
                  title={editedEmail?.to ? "AI Assistant" : "Please enter recipient email first"}
                  onClick={() => editedEmail?.to && setShowAIPrompt(true)}
                  disabled={!editedEmail?.to}
                >
                  <SparklesIcon className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded" title="Formatting options">
                  <svg className="w-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded" title="Attach files">
                  <svg className="w-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {showComposeModal && (
        <Draggable handle=".modal-handle" bounds="body">
          <div className="fixed bottom-0 right-24 w-[600px] bg-white rounded-t-xl shadow-2xl z-50 flex flex-col">
            {/* Modal Header */}
            <div className="modal-handle flex items-center justify-between px-4 py-2 bg-gray-100 rounded-t-lg cursor-move">
              <h3 className="text-sm font-medium text-gray-700">New Message</h3>
              <div className="flex items-center space-x-2">
                <button 
                  className="p-1.5 hover:bg-gray-200 rounded-full"
                  title="Minimize"
                  onClick={() => {
                    handleMinimize({ ...newEmail, id: 'compose' });
                    setShowComposeModal(false);
                  }}
                >
                  <MinusIcon className="h-4 w-4 text-gray-600" />
                </button>
                <button 
                  onClick={() => setShowComposeModal(false)}
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
              <div className="flex flex-col border-b py-2">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 w-12">To</span>
                  <input 
                    type="email" 
                    value={newEmail.to}
                    onChange={(e) => {
                      handleComposeInputChange('to', e.target.value);
                      // Clear error when user starts typing
                      if (formErrors.to) {
                        setFormErrors(prev => ({ ...prev, to: '' }));
                      }
                    }}
                    className={`flex-1 outline-none text-sm ${formErrors.to ? 'border-red-300' : ''}`}
                    placeholder="recipient@example.com"
                  />
                </div>
                {formErrors.to && (
                  <span className="text-red-500 text-xs ml-12 mt-1">{formErrors.to}</span>
                )}
              </div>

              {/* Subject */}
              <div className="flex flex-col border-b py-2">
                <div className="flex items-center">
                  <input 
                    type="text"
                    value={newEmail.subject}
                    onChange={(e) => {
                      handleComposeInputChange('subject', e.target.value);
                      if (formErrors.subject) {
                        setFormErrors(prev => ({ ...prev, subject: '' }));
                      }
                    }}
                    placeholder="Subject"
                    className={`flex-1 outline-none text-sm ${formErrors.subject ? 'border-red-300' : ''}`}
                  />
                </div>
                {formErrors.subject && (
                  <span className="text-red-500 text-xs mt-1">{formErrors.subject}</span>
                )}
              </div>

              {/* Body */}
              <div className="mt-4 h-[300px] flex flex-col relative">
                <textarea 
                  className={`w-full h-full outline-none text-sm resize-none p-2 ${formErrors.body ? 'border-red-300' : ''}`}
                  value={newEmail.body}
                  onChange={(e) => {
                    handleComposeInputChange('body', e.target.value);
                    if (formErrors.body) {
                      setFormErrors(prev => ({ ...prev, body: '' }));
                    }
                  }}
                  placeholder="Write your email..."
                />
                {formErrors.body && (
                  <span className="text-red-500 text-xs mt-1">{formErrors.body}</span>
                )}
                
                <EmailComposerModal 
                  recipientEmail={newEmail.to}
                  onUpdateBody={(newBody) => handleComposeInputChange('body', newBody)}
                  onUpdateSubject={(newSubject) => handleComposeInputChange('subject', newSubject)}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t flex items-center justify-between">
              <div className="flex space-x-2">
                <button 
                  className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  onClick={handleComposeEmail}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
                <button 
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors disabled:bg-gray-400"
                  onClick={handleSaveAsDraft}
                  disabled={loading}
                >
                  Save as Draft
                </button>
                <button 
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                  onClick={() => setShowComposeModal(false)}
                >
                  Discard
                </button>
              </div>
              
              {/* Formatting Tools */}
              <div className="flex items-center space-x-2 text-gray-600">
                <button 
                  className={`p-2 rounded ${
                      newEmail.to ? 'hover:bg-gray-100 text-gray-600' : 'text-gray-300 cursor-not-allowed'
                  }`}
                  title={newEmail.to ? "AI Assistant" : "Please enter recipient email first"}
                  onClick={() => newEmail.to && setShowAIPrompt(true)}
                  disabled={!newEmail.to}
                >
                  <SparklesIcon className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded" title="Formatting options">
                  <svg className="w-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded" title="Attach files">
                  <svg className="w-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Draggable>
      )}

      {showAIPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[500px] p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">AI Email Assistant</h3>
              <button 
                onClick={() => setShowAIPrompt(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Let AI craft your perfect email
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Describe your email's purpose, and our AI will generate professional content tailored to your needs.
              </p>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAIPrompt(e.target.value)}
                className="w-full h-32 p-3 border rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Example: Generate a follow-up email to introduce our product to a potential client who showed interest at the recent tech conference"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAIPrompt(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAIGenerate}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MailboxView 