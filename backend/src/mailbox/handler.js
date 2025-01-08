import MailboxService from "./service.js";
import { sendMail } from "../../utils/sendMail.js";

const service = new MailboxService()
class MailboxHandler {

    async draftEmail(req, res){

        try{

            const { subject, body, to, from } = req.body;

            if (!subject || !body || !to) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields: subject, body, or recipient"
                });
            }

            const response = await service.draftEmail(subject, body, to, from)
            
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

            const response = await service.listDraftEmail()
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

            const { emailId, subject, body, to, from } = req.body;

            if (!subject || !body || !to) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields: subject, body, or recipient"
                });
            }

            const response = await service.updateDraftEmail(emailId, subject, body, to, from)
            
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
            const { emailId, subject, body, to, from } = req.body;
            
            // Send email using external service
            const emailSendResp = await sendMail(req.body);
            console.log("emailSendResp===>", emailSendResp);

            // Update or create email in database
            const storeSentMail = await service.sendEmail(emailId, subject, body, to, from);

            res.status(200).json({
                success: true,
                message: "Email sent!",
                data: storeSentMail
            });

        } catch (error) {
            console.log("Handler Error===>", error);
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        }        
    }

    async listSentEmail(req, res){
        try{

            const response = await service.listSentEmail()
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

    async starEmail(email, recipient) {

    }

    async deleteEmail(email, recipient) {

    }

    async inboxEmail(email, recipient) {

    }

}

export default MailboxHandler;
