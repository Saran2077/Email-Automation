import {AzureOpenai} from "openai";
import { getPromptForStage } from "../../utils/helpers/prompt_repo.js";

class EmailGenerationService {

    async generateEmail(userStage){
        try{
            const azureOpenai = new AzureOpenai({
                apiKey: process.env.AZURE_OPENAI_API_KEY,
                endpoint: process.env.AZURE_OPENAI_ENDPOINT,
                deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
                version: process.env.AZURE_OPENAI_VERSION
            });

            const prompt = getPromptForStage(userStage);
            
            const response = await azureOpenai.chat.completions.create({
                messages: [{ role: "system", content: prompt }],
                model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
                temperature: 0.7,
                max_tokens: 500
            });

            const email = response.choices[0].message.content;
            
            console.log("Email generated: ", email);

            return email;
            
        } catch(error){
            console.log("Service error in generating email: ", error);
            throw error;
        }
    }
}

export default EmailGenerationService;
