import { AzureOpenAI } from "openai";
import { getPromptForStage } from "../../utils/helpers/prompt_repo.js";
import RecipientRepository from "../../utils/repository/Recipient.js";
class EmailGenerationService {

    async generateEmail(userStage){
        try{
            const azureOpenai = new AzureOpenAI({
                apiKey: process.env.AZURE_OPENAI_API_KEY,
                endpoint: process.env.AZURE_OPENAI_ENDPOINT,
                deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
                apiVersion: "2024-02-01"
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

    async generateEmailWithAI(toEmail, aiPrompt){
        try{
            const azureOpenai = new AzureOpenAI({
                apiKey: process.env.AZURE_OPENAI_API_KEY,
                endpoint: process.env.AZURE_OPENAI_ENDPOINT,
                deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
                apiVersion: process.env.AZURE_OPENAI_VERSION
            });

            const recipient = await RecipientRepository.getByEmail(toEmail);
            const payload = {
                stage: recipient.stage,
                target_data: {
                    companyName: recipient.companyName,
                    companyDescription: recipient.companyDescription,
                    industry: recipient.industry,
                    name: recipient.name,
                    designation: recipient.designation,
                    shortBio: recipient.shortBio
                },
                aiPrompt: aiPrompt
            }

            const prompt = getPromptForStage(payload);

            console.log("Prompt: ", prompt)

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
