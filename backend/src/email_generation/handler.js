import EmailGenerationService from "./service";

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

}

export default EmailGenerationHandler;