import EmailRepository from "../../utils/repository/Email.js";
import { Recipient } from "../../utils/models/Recipient.js";
import { addContactTags, getContactsData, updateContact } from "../services/activeCampaign.js";

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

    async sendEmail(emailId, subject, body, to, from) {
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
                        status: 'sent'
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
                    status: 'sent'
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
                { isSent: true, status: 'sent' }
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


    async deleteEmail(email, recipient) {

    }

    // async inboxEmail(email, recipient) {

    // }

}

export default MailboxService;
