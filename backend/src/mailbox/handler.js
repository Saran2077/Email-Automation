import MailboxService from "./service.js";


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

    async sendEmail(email, recipient) {
        
    }

    async starEmail(email, recipient) {

    }

    async deleteEmail(email, recipient) {

    }

    async inboxEmail(email, recipient) {

    }

}

export default MailboxHandler;
