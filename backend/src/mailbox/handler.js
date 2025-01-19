import MailboxService from "./service.js";
import { sendMail } from "../../utils/sendMail.js";
import JsonWebToken from "../../middleware/jwt.js";

const service = new MailboxService()
const jwt = new JsonWebToken();
class MailboxHandler {

    async draftEmail(req, res){

        try{
            const { headers } = req;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;
            const { subject, body, to, from, attachments } = req.body;

            if (!subject || !body || !to) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields: subject, body, or recipient"
                });
            }

            const response = await service.draftEmail(subject, body, to, from, attachments, userId)
            
            res.status(200).json({
                success: true,
                data: response
            })

        } catch(error){
            console.log("Handler Error===>", error)
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }

    }

    async listDraftEmail(req, res){
        try{

            const { headers } = req;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;

            const response = await service.listDraftEmail(userId)
            res.status(200).json({
                success: true,
                data: response
            })

        } catch(error){
            console.log("Handler Error===>", error)
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }

    async updateDraftEmail(req, res){

        try{
            const { headers } = req;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;

            const { emailId, subject, body, to, from, attachments } = req.body;

            if (!subject || !body || !to) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields: subject, body, or recipient"
                });
            }

            const response = await service.updateDraftEmail(emailId, subject, body, to, from, attachments, userId)
            
            res.status(200).json({
                success: true,
                data: response
            })

        } catch(error){
            console.log("Handler Error===>", error)
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }

    }

    async sendEmail(req, res) {
        try {
            const { emailId, subject, body, to, from, attachments } = req.body;
            const { headers } = req;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;

            // Process attachments if they exist
            let processedAttachments = [];
            if (attachments && Array.isArray(attachments)) {
                processedAttachments = attachments.map(attachment => ({
                    name: attachment.name,
                    type: attachment.type,
                    size: attachment.size,
                    data: attachment.data
                }));
            }

            // Send email using external service
            const emailSendResp = await sendMail({
                emailId,
                subject,
                body,
                to,
                from,
                attachments: processedAttachments
            });

            // Update or create email in database
            const storeSentMail = await service.sendEmail(
                emailId,
                subject,
                body,
                to,
                from,
                processedAttachments, // Pass the processed attachments
                emailSendResp,
                Number(userId)
            );

            res.status(200).json({
                success: true,
                message: "Email sent!",
                data: storeSentMail
            });

        } catch (error) {
            console.error("Handler Error===>", error);
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        }        
    }

    async listSentEmail(req, res){
        try{
            const { headers } = req;    
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;
            const response = await service.listSentEmail(userId)
            res.status(200).json({
                success: true,
                data: response
            })

        } catch(error){
            console.log("Handler Error===>", error)
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }

    async listStarEmail(req, res) {
        try {
            const { headers } = req;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;
            const response = await service.listStarEmail(userId)
            res.status(200).json({
                success: true,
                data: response
            })
        } catch (error) {
            console.log("Handler Error===>", error)
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }

    async starEmail(req, res) {
        try {
            const { id } = req.params;
            console.log(id)
            const { headers } = req;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;
            const star = await service.starEmail(id, userId);

            res.status(200).json({
                success: true,
                data: star
            })
        } catch (error) {
            console.log("Handler Error===>", error)
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }

    async getEmailById(req, res) {
        try {
            const { id } = req.params;
            const { headers } = req;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;
            const email = await service.getEmailById(id, userId);

            res.status(200).json({
                success: true,
                data: email
            })
        } catch (error) {
            console.log("Handler Error===>", error)
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }

    async deleteEmail(email, recipient) {

    }

    async inboxEmail(req, res) {
        try{
            const { headers } = req;
            const decoded = jwt.verify(headers.authorization.split(' ')[1]);
            const userId = decoded.userId;
            const response = await service.inboxEmail(userId)
            res.status(200).json({
                success: true,
                data: response
            })

        } catch(error){
            console.log("Handler Error===>", error)
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }

}

export default MailboxHandler;
