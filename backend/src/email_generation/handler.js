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
            const {toEmail, customContext} = body;

            const response = await service.generateEmailWithAI(toEmail, customContext);

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

    async promptTemplateCreation(req, res){
        try {
            const response = await service.promptTemplateCreation();
            
            res.status(200).json({
                message: "Prompt templates created successfully",
                data: response
            });
        } catch (error) {
            console.log("Handler error in prompt template creation: ", error);
            res.status(500).json({
                message: error.message || "Internal server error"
            });
        }
    }

    async getPromptTemplate(req, res){
        try{
            const {params} = req;
            const {email} = params;

            const response = await service.getTemplateForRecipient(email);

            res.status(200).json({
                message: "Prompt template fetched successfully",
                data: response
            });
        } catch(error){

        }
    }

    async updatePromptTemplate(req, res){
        try{
            const {params} = req;
            const {email} = params;

            const { data } = req.body;

            console.log(data)

            const response = await service.getTemplateForRecipient(email);
            console.log(response)
            const updateResponse = await service.updateTemplateForRecipient(response?.promptTemplateId, data)



            res.status(200).json({
                message: "Prompt template updated successfully",
                data: updateResponse
            });
        } catch(error){

        }
    }

}

export default EmailGenerationHandler;