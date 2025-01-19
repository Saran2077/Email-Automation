import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  StarIcon as StarIconOutline,
  TrashIcon,
  ArrowPathIcon,
  UserCircleIcon,
  PrinterIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { mailboxAPI } from '../utils/apiLayer.js';
import { toast } from 'react-toastify';
import { ReplyIcon, Forward, MoreHorizontal } from 'lucide-react';

const EmailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchEmail();
  }, [id]);

  const fetchEmail = async () => {
    try {
      setLoading(true);
      const response = await mailboxAPI.getEmail(id);
      setEmail(response);
    } catch (err) {
      setError('Failed to fetch email details');
      toast.error('Could not load email');
    } finally {
      setLoading(false);
    }
  };

  const handleForward = () => {
    navigate('/mailbox', {
      state: {
        subject: `Fwd: ${email.subject}`,
        originalEmail: email,
        body: `\n\n---------- Forwarded message ---------\nFrom: ${email.from}\nDate: ${format(new Date(email.createdAt), 'PPP p')}\nSubject: ${email.subject}\nTo: ${email.to.email}\n\n${email.body}`,
        isForward: true
      }
    });
  };

  const toggleStar = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const response = await mailboxAPI.updateStarEmail(id);
      if (response.success) {
        setEmail(prev => ({
          ...prev,
          isStarred: !prev.isStarred
        }));
        toast.success(email.isStarred ? 'Email unstarred' : 'Email starred');
      }
    } catch (err) {
      toast.error('Failed to update star status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to move this email to trash?')) {
      try {
        await mailboxAPI.moveToTrash(id);
        toast.success('Email moved to trash');
        navigate(-1);
      } catch (err) {
        toast.error('Failed to delete email');
      }
    }
  };

  const handleReply = () => {
    navigate('/compose', { 
      state: { 
        replyTo: email.from,
        subject: `Re: ${email.subject}`,
        originalEmail: email
      }
    });
  };

  const sanitizeEmailBody = (htmlContent) => {
    if (!htmlContent) return '';
    
    // Replace multiple consecutive line breaks with a single one
    let cleanedContent = htmlContent.replace(/(\r\n|\n|\r){2,}/gm, '\n');
    
    // Ensure paragraphs have proper spacing
    cleanedContent = cleanedContent.replace(/<\/p><p>/g, '</p>\n<p>');
    
    // Add proper list spacing
    cleanedContent = cleanedContent.replace(/<\/ul><p>/g, '</ul>\n<p>');
    cleanedContent = cleanedContent.replace(/<\/ol><p>/g, '</ol>\n<p>');
    
    // Ensure proper spacing around list items
    cleanedContent = cleanedContent.replace(/<\/li><li>/g, '</li>\n<li>');
    
    // Add proper spacing for signature
    cleanedContent = cleanedContent.replace(/<br>/g, '<br>\n');
    
    return cleanedContent;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
        <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !email) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
        <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-500 mb-4">{error || 'Email not found'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-5 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="mx-auto bg-white shadow-lg">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              {/* <div className="ml-4 flex space-x-1">
                <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center">
                  <ReplyIcon className="w-4 h-4 mr-2" />
                  Reply
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center" onClick={handleForward}>
                  <Forward className="w-4 h-4 mr-2" />
                  Forward
                </button>
              </div> */}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleStar}
                disabled={isUpdating}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title={email.isStarred ? "Unstar" : "Star"}
              >
                {email.isStarred ? (
                  <StarIconSolid className="w-5 h-5 text-yellow-400" />
                ) : (
                  <StarIconOutline className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {/* <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <PrinterIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <ArchiveBoxIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-full hover:bg-red-50 transition-colors group"
                title="Move to trash"
              >
                <TrashIcon className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </button> */}
            </div>
          </div>
        </div>

        {/* Email Content */}
        <div className="px-8 py-6">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              {email.subject}
            </h1>

            <div className="flex items-start mb-6 bg-gray-50 p-4 rounded-xl">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-semibold">
                  {email.from.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-4 flex-grow">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-medium text-gray-900">{email.from}</span>
                    <span className="text-gray-500 text-sm ml-2">{`<${email.from}>`}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <EnvelopeIcon className="w-4 h-4 mr-2" />
                    {format(new Date(email.createdAt), 'PPP p')}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2 flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">To</span>
                  <span className="ml-2">{email.to.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="prose max-w-none text-gray-800 mb-8 bg-white p-6 rounded-xl border border-gray-100">
            <div 
              className="email-content"
              dangerouslySetInnerHTML={{ 
                __html: sanitizeEmailBody(email.body) 
              }} 
            />
          </div>

          {/* Attachments */}
          {email.attachments?.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Attachments</h2>
              <ul className="space-y-2">
                {email.attachments.map((attachment, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <svg 
                      className="w-5 h-5 text-gray-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" 
                      />
                    </svg>
                    <a
                      href={attachment.data}
                      download={attachment.name}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {attachment.name} ({(attachment.size / 1024).toFixed(1)} KB)
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="text-xs text-gray-500 border-t pt-4">
            <div className="flex flex-wrap gap-4 bg-gray-50 p-3 rounded-lg">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Email ID: {email.id}
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Created: {format(new Date(email.createdAt), 'PPP p')}
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Last Updated: {format(new Date(email.updatedAt), 'PPP p')}
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                Type: {email.isDraft ? 'Draft' : email.isSent ? 'Sent' : 'Received'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailView;