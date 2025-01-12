import { useState } from 'react';
import {
    Modal,
    Box,
    IconButton,
} from '@mui/material';
import { SparklesIcon } from '@heroicons/react/24/outline';
import PromptTemplateEditor from './PromptTemplateEditor';
import { promptAPI } from '../../utils/apiLayer';
import { toast } from 'react-toastify';

const EmailComposerModal = ({ recipientEmail, onUpdateBody, onUpdateSubject }) => {
    const [showPromptEditor, setShowPromptEditor] = useState(false);
    const [newEmail, setNewEmail] = useState({ subject: '', body: '' });

    const handleGenerateEmail = async (customContext) => {
        try {
            if (!recipientEmail) {
                toast.error('Please enter recipient email first');
                return;
            }

            const response = await promptAPI.generateEmail(recipientEmail, customContext);
            
            if (response?.data) {
                const { body } = response.data;
                onUpdateBody(body);
                toast.success('Email content generated successfully!');
            } else {
                throw new Error('Invalid response format from AI service');
            }
        } catch (error) {
            console.error('Error generating email:', error);
            toast.error('Failed to generate email content. Please try again.');
        }
    };

    return (
        <Box sx={{ position: 'absolute', right: 10, bottom: 10 }}>
            <IconButton 
                onClick={() => setShowPromptEditor(true)}
                title={recipientEmail ? "AI Assistant" : "Please enter recipient email first"}
                disabled={!recipientEmail}
                sx={{ 
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: 'primary.dark',
                    },
                    '&.Mui-disabled': {
                        backgroundColor: 'grey.400',
                        color: 'grey.100'
                    }
                }}
            >
                <SparklesIcon className="h-5 w-5" />
            </IconButton>

            <Modal
                open={showPromptEditor}
                onClose={() => setShowPromptEditor(false)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Box sx={{
                    width: '80%',
                    maxWidth: 800,
                    maxHeight: '90vh',
                    overflow: 'auto',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    p: 3,
                    outline: 'none'
                }}>
                    <PromptTemplateEditor 
                        recipientEmail={recipientEmail}
                        onUpdateBody={onUpdateBody}
                        onUpdateSubject={onUpdateSubject}
                        onClose={() => setShowPromptEditor(false)}
                    />
                </Box>
            </Modal>
        </Box>
    );
}; 

export default EmailComposerModal;