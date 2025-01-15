import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TextField,
    Button,
    Box,
    Typography,
    Collapse
} from '@mui/material';
import { 
    PlusIcon, 
    PencilIcon, 
    TrashIcon, 
    CheckIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    AdjustmentsHorizontalIcon,
    XMarkIcon,
    CogIcon,
    DocumentTextIcon,
    PlayIcon
} from '@heroicons/react/24/outline';
import { mailboxAPI, promptAPI } from '../../utils/apiLayer';
import { toast } from 'react-toastify';

// Helper function to format section names for display
const formatSectionName = (name) => {
    // First split by capital letters
    const words = name.split(/(?=[A-Z])/)
    // Capitalize first letter of first word
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
    // Join with spaces
    return words.join(' ')
};

const PromptTemplateEditor = ({ recipientEmail, onUpdateBody, onUpdateSubject, onClose }) => {
    const [templateData, setTemplateData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedSections, setExpandedSections] = useState({});
    const [editMode, setEditMode] = useState({});
    const [newRows, setNewRows] = useState({});
    const [customInstructions, setCustomInstructions] = useState('');

    const [customPrompts, setCustomPrompts] = useState([]);
    const [showPromptForm, setShowPromptForm] = useState(false);
    const [newPrompt, setNewPrompt] = useState({ name: '', content: '' });

    // Previous useEffect and functions remain the same...

    const handleAddPrompt = async () => {
        if (newPrompt.name && newPrompt.content) {
            setCustomPrompts([...customPrompts, { ...newPrompt }]);
            const response = await promptAPI.updatePromptTemplate(recipientEmail, {data: { customPrompt: [...customPrompts, { ...newPrompt }]}})
            setNewPrompt({ name: '', content: '' });
            setShowPromptForm(false);
            toast.success('Custom prompt added successfully!');
        }
    };

    const handleDeletePrompt = async (index) => {
        setCustomPrompts(customPrompts.filter((_, i) => i !== index));
        const response = await promptAPI.updatePromptTemplate(recipientEmail, {data: { customPrompt: customPrompts.filter((_, i) => i !== index)}})
        toast.success('Custom prompt removed');
    };

    const handleEditPrompt = (index) => {
        setNewPrompt(customPrompts[index]);
        setCustomPrompts(customPrompts.filter((_, i) => i !== index));
        setShowPromptForm(true);
    };

    useEffect(() => {
        fetchTemplateData();
    }, [recipientEmail]);

    const fetchTemplateData = async () => {
        try {
            const result = await promptAPI.getPromptTemplate(recipientEmail);
            if (result.data) {
                setTemplateData(result.data);
                setCustomPrompts(result?.data?.customPrompt || [])
                // Initialize expanded sections
                const sections = Object.keys(result.data).filter(key => 
                    typeof result.data[key] === 'object' && !Array.isArray(result.data[key])
                );
                const initialExpanded = sections.reduce((acc, section) => ({
                    ...acc,
                    [section]: true
                }), {});
                setExpandedSections(initialExpanded);
            }
        } catch (err) {
            setError('Failed to fetch template data');
            toast.error('Failed to fetch template data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateEmail = async () => {
        try {
            setLoading(true);
            const result = await promptAPI.generateEmail(recipientEmail, {
                ...templateData,
                customInstructions,
                customPrompt: null
            });
            if (result?.data) {
                const { body, subject } = result.data;
                onUpdateBody(body);
                onUpdateSubject(subject);
                toast.success('Email generated successfully!');
                onClose();
            }
        } catch (error) {
            toast.error('Failed to generate email');
            console.error('Failed to generate email:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyPrompt = async (index) => {
        try {
            setLoading(true);
            const result = await promptAPI.generateEmail(recipientEmail, {
                ...templateData,
                customInstructions,
                customPrompt: customPrompts[index]
            });
            if (result?.data) {
                const { body, subject } = result.data;
                onUpdateBody(body);
                onUpdateSubject(subject);
                toast.success('Email generated successfully!');
                onClose();
            }
        } catch (error) {
            toast.error('Failed to generate email');
            console.error('Failed to generate email:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleEdit = (section, key) => {
        setEditMode(prev => ({
            ...prev,
            [`${section}-${key}`]: true
        }));
    };

    const handleSave = (section, key, value) => {
        setTemplateData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
        setEditMode(prev => ({
            ...prev,
            [`${section}-${key}`]: false
        }));
    };

    const addNewRow = (section) => {
        setNewRows(prev => ({
            ...prev,
            [section]: [...(prev[section] || []), { key: '', value: '' }]
        }));
    };

    const handleNewRowChange = (section, index, field, value) => {
        setNewRows(prev => ({
            ...prev,
            [section]: prev[section].map((row, i) => 
                i === index ? { ...row, [field]: value } : row
            )
        }));
    };

    const saveNewRow = (section, index) => {
        const newRow = newRows[section][index];
        if (newRow.key && newRow.value) {
            setTemplateData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [newRow.key]: newRow.value
                }
            }));
            setNewRows(prev => ({
                ...prev,
                [section]: prev[section].filter((_, i) => i !== index)
            }));
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-8 ">
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                <div className="w-16 h-16 relative">
                    <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <CogIcon className="h-8 w-8 text-blue-600 animate-pulse" />
                    </div>
                </div>
                <p className="mt-4 text-gray-700 font-medium">Loading template data...</p>
                <p className="text-sm text-gray-500">Please wait</p>
            </div>
        </div>
    );
    if (error) return <div>Error: {error}</div>;
    if (!templateData) return (
        <div className="flex items-center justify-center p-4">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <CogIcon className="h-8 w-8 text-gray-400" />
                    </div>
                </div>
                <p className="mt-2 text-sm text-gray-700 font-medium">No template data available</p>
               
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto relative">
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
                    <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                        <div className="w-16 h-16 relative">
                            <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <CogIcon className="h-8 w-8 text-blue-600 animate-pulse" />
                            </div>
                        </div>
                        <p className="mt-4 text-gray-700 font-medium">Generating your email...</p>
                        <p className="text-sm text-gray-500">This may take a few seconds</p>
                    </div>
                </div>
            )}

            {/* Header with close button */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <CogIcon className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-800">Email Context Editor</h2>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="contained"
                        onClick={recipientEmail ? handleGenerateEmail : undefined}
                        disabled={loading || !recipientEmail}
                        className={`${
                            !recipientEmail 
                            ? 'bg-gray-300 cursor-not-allowed opacity-50' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        // startIcon={<CogIcon className="h-5 w-5" />}
                        title={!recipientEmail ? "Please enter recipient email first" : "Generate Email"}
                    >
                        {loading ? 'Generating...' : 'Generate Email'}
                    </Button>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="Close"
                    >
                        <XMarkIcon className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Sections */}
            {Object.entries(templateData || {})
                .filter(([key, value]) => 
                    typeof value === 'object' && 
                    !Array.isArray(value) && 
                    key !== '_id' && 
                    key !== '__v'
                )
                .map(([sectionName, sectionData]) => (
                    <div key={sectionName} className="mb-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => toggleSection(sectionName)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    {expandedSections[sectionName] ? 
                                        <ChevronUpIcon className="h-5 w-5" /> : 
                                        <ChevronDownIcon className="h-5 w-5" />
                                    }
                                </button>
                                <h3 className="text-lg font-medium text-gray-700">
                                    {formatSectionName(sectionName)}
                                </h3>
                            </div>
                            <Button
                                onClick={() => addNewRow(sectionName)}
                                className="text-blue-600 hover:text-blue-700 text-sm"
                                startIcon={<PlusIcon className="h-4 w-4" />}
                            >
                                Add Field
                            </Button>
                        </div>

                        <Collapse in={expandedSections[sectionName]}>
                            <TableContainer className="border-t border-gray-200">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow className="bg-gray-50">
                                            <TableCell className="font-medium text-gray-600">Field</TableCell>
                                            <TableCell className="font-medium text-gray-600">Value</TableCell>
                                            <TableCell align="right" className="font-medium text-gray-600">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.entries(sectionData).map(([key, value]) => (
                                            <TableRow key={key} className="hover:bg-gray-50">
                                                <TableCell className="text-gray-700">{key}</TableCell>
                                                <TableCell>
                                                    {editMode[`${sectionName}-${key}`] ? (
                                                        <TextField
                                                            fullWidth
                                                            defaultValue={value}
                                                            onBlur={(e) => handleSave(sectionName, key, e.target.value)}
                                                            variant="outlined"
                                                            size="small"
                                                            className="bg-white"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-700">{value}</span>
                                                    )}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton 
                                                        onClick={() => handleEdit(sectionName, key)}
                                                        size="small"
                                                        className="text-gray-500 hover:text-blue-600"
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {/* New Row Input Fields */}
                                        {newRows[sectionName]?.map((row, index) => (
                                            <TableRow key={`new-${index}`} className="bg-gray-50">
                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        value={row.key}
                                                        onChange={(e) => handleNewRowChange(sectionName, index, 'key', e.target.value)}
                                                        placeholder="New field name"
                                                        className="bg-white"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        value={row.value}
                                                        onChange={(e) => handleNewRowChange(sectionName, index, 'value', e.target.value)}
                                                        placeholder="Value"
                                                        className="bg-white"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton 
                                                        onClick={() => saveNewRow(sectionName, index)}
                                                        size="small"
                                                        className="text-green-600 hover:text-green-700"
                                                    >
                                                        <CheckIcon className="h-4 w-4" />
                                                    </IconButton>
                                                    <IconButton 
                                                        onClick={() => {
                                                            setNewRows(prev => ({
                                                                ...prev,
                                                                [sectionName]: prev[sectionName].filter((_, i) => i !== index)
                                                            }));
                                                        }}
                                                        size="small"
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Collapse>
                    </div>
                ))}

            {/* Custom Instructions Section */}
            <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 mb-3">
                    <CogIcon className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-medium text-gray-700">Additional Instructions</h3>
                </div>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="Add any specific instructions for email generation..."
                    variant="outlined"
                    className="bg-white"
                />
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-medium text-gray-700">Custom Prompts</h3>
                    </div>
                    <Button
                        onClick={() => setShowPromptForm(true)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                        startIcon={<PlusIcon className="h-4 w-4" />}
                    >
                        Add Prompt
                    </Button>
                </div>

                {showPromptForm && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex flex-col gap-3">
                            <TextField
                                fullWidth
                                label="Prompt Name"
                                value={newPrompt.name}
                                onChange={(e) => setNewPrompt({ ...newPrompt, name: e.target.value })}
                                size="small"
                                className="bg-white"
                            />
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Prompt Content"
                                value={newPrompt.content}
                                onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })}
                                className="bg-white"
                            />
                            <div className="flex justify-end gap-2">
                                <Button
                                    onClick={() => {
                                        setShowPromptForm(false);
                                        setNewPrompt({ name: '', content: '' });
                                    }}
                                    variant="outlined"
                                    color="inherit"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleAddPrompt}
                                    variant="contained"
                                    color="primary"
                                    disabled={!newPrompt.name || !newPrompt.content}
                                >
                                    Save Prompt
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Prompts List */}
                {customPrompts.length > 0 ? (
                    <div className="space-y-3">
                        {customPrompts.map((prompt, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-gray-700">{prompt.name}</h4>
                                        <p className="text-gray-600 mt-1 text-sm">{prompt.content}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <IconButton
                                            onClick={() => handleApplyPrompt(index)}
                                            size="small"
                                            className="text-gray-500 hover:text-green-600"
                                        >
                                            <PlayIcon className="h-4 w-4" />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleEditPrompt(index)}
                                            size="small"
                                            className="text-gray-500 hover:text-blue-600"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDeletePrompt(index)}
                                            size="small"
                                            className="text-gray-500 hover:text-red-600"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-500">
                        No custom prompts added yet
                    </div>
                )}
            </div>
        </div>
    );
};

export default PromptTemplateEditor; 