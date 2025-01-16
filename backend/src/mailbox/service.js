import EmailRepository from "../../utils/repository/Email.js";
import { Recipient } from "../../utils/models/Recipient.js";
import { addContactTags, getContactsData, updateContact } from "../services/activeCampaign.js";

const emailRepository = new EmailRepository()
class MailboxService {

    async draftEmail(subject, body, to, from){
        try{
            let toRecipient = await Recipient.findOne({ email: to });
            if (!toRecipient) {
                toRecipient = await Recipient.create({ 
                    email: to,
                    name: to.split('@')[0]
                });
            }

            // Generate a unique messageId for drafts
            const draftMessageId = `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const payload = {
                subject: subject,
                body: body,
                from: from,
                to: toRecipient._id,
                messageId: draftMessageId,
                isDraft: true,
                isSent: false
            }

            console.log('Creating email with payload:', payload);

            const createDraft = await emailRepository.create(payload)
            return createDraft
        } catch(error) {
            console.error('Service Error:', error);
            throw error;
        }
    }

    async listDraftEmail(){
        try {
            // Use the repository's getRecipientEmails method with 'drafts' type
            const draftEmails = await emailRepository.list(
                { isDraft: true }
            );

            return {
                success: true,
                data: {
                    drafts: draftEmails.emails,
                    totalItems: draftEmails.total
                }
            };
        } catch(error) {
            throw error;
        }
    }

    async listStarEmail(){
        try {
            // Use the repository's getRecipientEmails method with 'drafts' type
            const starEmails = await emailRepository.list(
                { isStarred: true }
            );

            return {
                success: true,
                data: {
                    starred: starEmails.emails,
                    totalItems: starEmails.total
                }
            };
        } catch(error) {
            throw error;
        }
    }

    async starEmail(id){
        try {
            // Use the repository's getRecipientEmails method with 'drafts' type
            console.log(1)
            const starEmails = await emailRepository.toggleStarred(id);

            return {
                success: true,
                data: {
                    message: "Successfully starred the email",
                }
            };
        } catch(error) {
            throw error;
        }
    }

    async inboxEmail(){
        try {
            // Use the repository's getRecipientEmails method with 'drafts' type
            const inboxEmails = await emailRepository.list(
                { isReceived: true }
            );

            return {
                success: true,
                data: {
                    inbox: inboxEmails.emails,
                    totalItems: inboxEmails.total
                }
            };
        } catch(error) {
            throw error;
        }
    }

    async updateDraftEmail(emailId, subject, body, to, from){
        try {
            let emailToSend;

            let toRecipient = await Recipient.findOne({ email: to });
            if (!toRecipient) {
                toRecipient = await Recipient.create({ 
                    email: to,
                    name: to.split('@')[0] // Basic name from email
                });
            }

            if (emailId) {
                // Update existing draft email
                emailToSend = await emailRepository.update(
                    { emailId },
                    {
                        subject,
                        body,
                        to: toRecipient._id,
                        from,
                        isDraft: true,
                        isSent: false,
                        status: 'draft'
                    }
                );
            } 
            else {
                throw new Error("Requested Email is not found")
            }

            console.log("sentEmailStored==>", emailToSend)

            return emailToSend;
        } catch (error) {
            console.error('Service Error:', error);
            throw error;
        }
    }

    async sendEmail(emailId, subject, body, to, from, message_id) {
        try {
            let emailToSend;

            let toRecipient = await Recipient.findOne({ email: to });
            if (!toRecipient) {
                toRecipient = await Recipient.create({ 
                    email: to,
                    name: to.split('@')[0] // Basic name from email
                });
            }

            if (emailId) {
                // Update existing draft email
                emailToSend = await emailRepository.update(
                    { emailId },
                    {
                        subject,
                        body,
                        to: toRecipient._id,
                        from,
                        isDraft: false,
                        isSent: true,
                        messageId: message_id
                    }
                );
            } else {
                // Create new email
                emailToSend = await emailRepository.create({
                    subject,
                    body,
                    to: toRecipient._id,
                    from,
                    isDraft: false,
                    isSent: true,
                    messageId: message_id
                });
            }

            const email = await getContactsData({ email: to })

            const id = email?.contacts?.[0]?.id;

            if (id) {
                await addContactTags(id, "9")
            }

            console.log("sentEmailStored==>", emailToSend)

            return emailToSend;
        } catch (error) {
            console.error('Service Error:', error);
            throw error;
        }
    }

    async listSentEmail(){
        try {
            // Use the repository's getRecipientEmails method with 'sent' type
            const sentEmails = await emailRepository.list(
                { isSent: true }
            );
            return {
                success: true,
                data: {
                    sent: sentEmails.emails,
                    totalItems: sentEmails.total
                }
            };
        } catch(error) {
            throw error;
        }
    }

    async getEmailById(emailId){
        try {
            // Use the repository's getRecipientEmails method with 'sent' type
            const email = await emailRepository.getById(emailId);
            return email;
        } catch(error) {
            throw error;
        }
    }


    async deleteEmail(email, recipient) {

    }

    // async inboxEmail(email, recipient) {

    // }

}

export default MailboxService;
