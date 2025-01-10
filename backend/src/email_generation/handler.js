import EmailGenerationService from "./service.js";

const service = new EmailGenerationService();

class EmailGenerationHandler {

    async generateEmail(req, res) {

        try{
            const {params} = req;
            const {userStage} = params;

            const response = await service.generateEmail(userStage);
            
            res.status(200).json({
                message: "Email generated successfully",
                data: response
            });
        } catch(error){
            console.log(error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
       
    }
    
    async generateEmailWithAI(req, res){
        try{

            const {body} = req;
            const {toEmail, aiPrompt} = body;

            const response = await service.generateEmailWithAI(toEmail, aiPrompt);

            res.status(200).json({
                message: "Email generated successfully",
                data: response
            });

        } catch(error){
            console.log("Handler error in generating email: ", error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    }
}

export default EmailGenerationHandler;