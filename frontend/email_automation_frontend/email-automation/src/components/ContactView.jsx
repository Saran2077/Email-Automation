import React, { useEffect, useState } from 'react';
import { Mail, Linkedin, Building2, User, Briefcase, Calendar, MessageSquare, Trophy, TrendingUp, Inbox, Send, Edit } from 'lucide-react';
import TextArea from 'antd/es/input/TextArea';
import { recipientAPI } from '../utils/apiLayer';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export default function ContactView() {
  const [stage, setStage] = useState(null);
  const navigate = useNavigate();
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingIndex, setEditingIndex] = useState(null);
  const [contact, setContact] = useState({});
  const [metrics, setMetrics] = useState({});
  const [emailHistory, setEmailHistory] = useState({ recipient: {}, emails: [] });
  const { id } = useParams();
  const [expandedEmails, setExpandedEmails] = useState(new Set());

  useEffect(() => {
    fetchContact();
    fetchMetrics();
  }, [id])

  useEffect(() => {
    if (id && activeTab === 'emails') {
        fetchEmailHistory();
    }
  }, [id, activeTab]);

  const fetchMetrics = async() => {
    try {
      if (!id) return;
      const response = await recipientAPI.getMetrics(id);
      console.log(response)
      setMetrics(response?.metrics);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchContact = async() => {
    try {
      if (!id) return;
      const response = await recipientAPI.getById(id);
      console.log(response)
      setContact(response);
      setStage(response?.stage)
    } catch (error) {
      console.error(error);
    }
  }

  const fetchEmailHistory = async () => {
    try {
        const response = await recipientAPI.getEmailHistory(id);
        setEmailHistory(response);
    } catch (error) {
        console.error('Error fetching email history:', error);
    }
  };

  const handleAddNote = () => {
    if (note.trim()) {
      const newNote = {
        text: note,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      };
      setNotes([newNote, ...notes]);
      setNote('');
    }
  };

  const handleStageChange = async (recipientData, newStage) => {
    try {
      await recipientAPI.updateStage(recipientData?._id, { stage: newStage, email: recipientData?.email })
      setContact((prevRecipients) => ({
        ...prevRecipients,
        stage: newStage
      })
        
      )
    } catch (err) {
      console.error('Error updating stage:', err)
      setError('Failed to update stage')
    }
  }

  const handleEditNote = (index) => {
    const updatedNote = prompt("Edit your note:", notes[index].text);
    if (updatedNote !== null) {
      const newNotes = [...notes];
      newNotes[index].text = updatedNote;
      setNotes(newNotes);
    }
  };

  const handleDeleteNote = (index) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
  };

  const stageColors = {
    Contact: 'bg-blue-100 text-blue-800',
    Lead: 'bg-yellow-100 text-yellow-800',
    Deal: 'bg-green-100 text-green-800',
    Account: 'bg-purple-100 text-purple-800'
  };

  const toggleEmailExpansion = (emailId) => {
    setExpandedEmails(prev => {
        const newSet = new Set(prev);
        if (newSet.has(emailId)) {
            newSet.delete(emailId);
        } else {
            newSet.add(emailId);
        }
        return newSet;
    });
  };

  const handleEditDraft = (email) => {
    navigate('/mailbox', {
        state: {
            draftEmail: {
                id: email._id,
                subject: email.subject,
                body: email.body,
                to: email.to.email,
                from: email.from,
                isDraft: true
            },
            suppressComposeModal: true
        }
    });
  };

  return (
    <div className="mx-auto p-6">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{contact.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${stageColors[stage]}`}>
                  {stage}
                </span>
              </div>
              <p className="flex items-center gap-2 text-blue-100">
                <Briefcase className="w-4 h-4" />
                {contact.designation} at {contact.company}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white/10 rounded-lg flex items-center gap-2 hover:bg-white/20 transition-colors backdrop-blur-sm" onClick={() => navigate('/mailbox', {state: {
                to: contact?.email,
                subject: '',
                body: ''
              }})}>
                <Mail className="w-4 h-4" /> Email
              </button>
              <button className="px-4 py-2 bg-white rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-colors text-blue-600" onClick={() => window.open(contact?.linkedinHandle)}>
                <Linkedin className="w-4 h-4" /> LinkedIn
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-blue-100 text-sm">Emails Delivered</p>
              <p className="text-2xl font-bold">{metrics.delivered || 0}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-blue-100 text-sm">Emails Opened</p>
              <p className="text-2xl font-bold">{metrics.opened || 0}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-blue-100 text-sm">Links Clicked</p>
              <p className="text-2xl font-bold">{metrics.clicked || 0}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-blue-100 text-sm">Failed Sends</p>
              <p className="text-2xl font-bold">{metrics.failed || 0}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-b">
          <div className="flex space-x-6 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 -mb-px font-medium text-sm flex items-center gap-2 
                ${activeTab === 'overview' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
            >
              <User className="w-4 h-4" /> Overview
            </button>
            {/* <button 
              onClick={() => setActiveTab('activity')}
              className={`py-4 px-2 -mb-px font-medium text-sm flex items-center gap-2 
                ${activeTab === 'activity' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
            >
              <TrendingUp className="w-4 h-4" /> Activity
            </button> */}
            <button 
              onClick={() => setActiveTab('notes')}
              className={`py-4 px-2 -mb-px font-medium text-sm flex items-center gap-2 
                ${activeTab === 'notes' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
            >
              <MessageSquare className="w-4 h-4" /> Notes
            </button>
            <button 
              onClick={() => setActiveTab('emails')}
              className={`py-4 px-2 -mb-px font-medium text-sm flex items-center gap-2 
                ${activeTab === 'emails' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Mail className="w-4 h-4" /> Emails
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                    <User className="w-5 h-5 text-blue-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-3 text-gray-600">
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {contact.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {contact.companyDomain}
                    </p>
                    <p className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-gray-400" />
                      {contact.industry}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Company Details
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{contact.Description}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Stage</h3>
                  <select 
                    value={stage} 
                    onChange={(e) => {setStage(e.target.value); handleStageChange(contact, e.target.value);}} 
                    className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="Contact">Contact</option>
                    <option value="Lead">Lead</option>
                    <option value="Deal">Deal</option>
                    <option value="Account">Account</option>
                  </select>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Background
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{contact.shortBio}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="max-w-2xl mx-auto">
              <TextArea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note..."
                className="w-full p-4 border rounded-lg mb-4 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <button 
                onClick={handleAddNote}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add Note
              </button>
              
              <div className="mt-6 space-y-4">
                {notes.map((n, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 overflow-hidden">
                    {editingIndex === index ? (
                      <>
                        <TextArea
                          value={n.text}
                          onChange={(e) => {
                            const newNotes = [...notes];
                            newNotes[index].text = e.target.value;
                            setNotes(newNotes);
                          }}
                          className="w-full p-2 border rounded-lg mb-2"
                        />
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => {
                              setEditingIndex(null);
                            }} 
                            className="text-blue-600 hover:underline"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => handleDeleteNote(index)} 
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-600 break-words">{n.text}</p>
                        <p className="text-sm text-gray-400 mt-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {n.date} at {n.time}
                        </p>
                        <div className="flex justify-end space-x-2 mt-2">
                          <button 
                            onClick={() => setEditingIndex(index)} 
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteNote(index)} 
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'emails' && (
            <div className="max-w-4xl mx-auto">
                <div className="space-y-4">
                    {emailHistory.emails.map((email) => (
                        <div key={email._id} className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden border border-gray-200">
                            <div 
                                onClick={() => toggleEmailExpansion(email._id)}
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                                email.type === 'sent' ? 'bg-green-100 text-green-700' :
                                                email.type === 'received' ? 'bg-blue-100 text-blue-700' :
                                                email.type === 'draft' ? 'bg-amber-100 text-amber-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {email.type.charAt(0).toUpperCase() + email.type.slice(1)}
                                            </span>
                                            <span className="font-medium text-gray-900">{email.subject}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {email.type === 'draft' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditDraft(email);
                                                    }}
                                                    className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                                                    title="Edit Draft"
                                                >
                                                    <Edit className="h-4 w-4 text-gray-600" />
                                                </button>
                                            )}
                                            <span className="text-sm text-gray-500">
                                                {new Date(email.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-gray-600 line-clamp-1 flex-1">
                                            {email.body.replace(/<[^>]*>/g, '')}
                                        </p>
                                        {email.isStarred && (
                                            <span className="text-yellow-400 flex-shrink-0">★</span>
                                        )}
                                        {expandedEmails.has(email._id) ? (
                                            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {expandedEmails.has(email._id) && (
                                <div className="border-t border-gray-200">
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    email.type === 'sent' ? 'bg-green-100 text-green-700' :
                                                    email.type === 'received' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {email.type.charAt(0).toUpperCase() + email.type.slice(1)}
                                                </span>
                                                {email.isStarred && (
                                                    <span className="text-yellow-400">★</span>
                                                )}
                                            </div>
                                        </div>
                                        <div 
                                            className="prose prose-sm max-w-none text-gray-700"
                                            dangerouslySetInnerHTML={{ __html: email.body }}
                                        />
                                        {email.status.length > 0 && (
                                            <div className="mt-4 flex gap-2">
                                                {email.status.map((status, idx) => (
                                                    <span 
                                                        key={idx}
                                                        className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                                                    >
                                                        {status}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {emailHistory.emails.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No email history found</p>
                    )}
                </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="max-w-2xl mx-auto">
              <p className="text-gray-500 text-center py-8">Activity timeline coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}