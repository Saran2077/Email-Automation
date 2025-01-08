import EmailRepository from "../../utils/repository/Email.js";
import { Recipient } from "../../utils/models/Recipient.js";

const emailRepository = new EmailRepository()
class MailboxService {

    async draftEmail(subject, body, to, from){
        try{
            // First, find or create the sender recipient
            // let fromRecipient = await Recipient.findOne({ email: from });
            // if (!fromRecipient) {
            //     fromRecipient = await Recipient.create({ 
            //         email: from,
            //         name: from.split('@')[0] // Basic name from email
            //     });
            // }

            // Then, find or create the receiver recipient
            let toRecipient = await Recipient.findOne({ email: to });
            if (!toRecipient) {
                toRecipient = await Recipient.create({ 
                    email: to,
                    name: to.split('@')[0] // Basic name from email
                });
            }

            // Now create the email with recipient IDs
            const payload = {
                subject: subject,
                body: body,
                from: from, // Use the MongoDB ObjectId
                to: toRecipient._id      // Use the MongoDB ObjectId
            }

            console.log('Creating email with payload:', payload); // Debug log

            const createDraft = await emailRepository.create(payload)
            return createDraft
        }
        catch(error){
            console.error('Service Error:', error); // Debug log
            throw error;
        }
    }

    async listDraftEmail(){
        try {
            // Use the repository's getRecipientEmails method with 'drafts' type
            const draftEmails = await emailRepository.list(
                { isDraft: true, status: 'draft' }
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

    async sendEmail(email, recipient) {

    }

    async starEmail(email, recipient) {

    }

    async deleteEmail(email, recipient) {

    }

    async inboxEmail(email, recipient) {

    }

}

export default MailboxService;
