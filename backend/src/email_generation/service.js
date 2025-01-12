import { AzureOpenAI } from "openai";
import { getPromptForStage } from "../../utils/helpers/prompt_repo.js";
import RecipientRepository from "../../utils/repository/Recipient.js";
import PromptTemplateRepository from "../../utils/repository/PromptTemplate.js";

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

    async generateEmailWithAI(toEmail, customContext = null) {
        try {
            const azureOpenai = new AzureOpenAI({
                apiKey: process.env.AZURE_OPENAI_API_KEY,
                endpoint: process.env.AZURE_OPENAI_ENDPOINT,
                deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
                apiVersion: process.env.AZURE_OPENAI_VERSION
            });

            let contextData = null;
            let stage = 'CONTACT';
            let customInstructions = '';

            // Extract custom instructions if provided
            if (customContext?.customInstructions) {
                customInstructions = customContext.customInstructions;
                delete customContext.customInstructions; // Remove from context to avoid confusion
            }

            // Always get base context first
            const template = await PromptTemplateRepository.getByEmail(toEmail);
            if (template) {
                contextData = {
                    senderCompanyContext: template.senderCompanyContext,
                    targetCompanyContext: template.targetCompanyContext,
                    recipientContext: template.recipientContext,
                    senderContext: template.senderContext
                };
                stage = template.stage;
            } else {
                const recipient = await RecipientRepository.getByEmail(toEmail);
                if (!recipient) throw new Error('Recipient not found');
                const newTemplate = await this.createDefaultTemplate(recipient);
                contextData = {
                    senderCompanyContext: newTemplate.senderCompanyContext,
                    targetCompanyContext: newTemplate.targetCompanyContext,
                    recipientContext: newTemplate.recipientContext,
                    senderContext: newTemplate.senderContext
                };
            }

            // Prepare payload with properly structured contexts
            const payload = {
                stage,
                contextData,
                customContext: customContext ? {
                    senderCompanyContext: customContext.senderCompanyContext || {},
                    targetCompanyContext: customContext.targetCompanyContext || {},
                    recipientContext: customContext.recipientContext || {},
                    senderContext: customContext.senderContext || {}
                } : null,
                customInstructions // Add custom instructions to payload
            };

            const prompt = getPromptForStage(payload);
            console.log("Generated Prompt: ", prompt);

            const response = await azureOpenai.chat.completions.create({
                messages: [{ role: "system", content: prompt }],
                model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
                temperature: 0.7,
                max_tokens: 500
            });

            const email = response.choices[0].message.content;
            
            try {
                const parsedEmail = JSON.parse(email);
                return parsedEmail;
            } catch (e) {
                console.error("Failed to parse email JSON:", e);
                return { body: email }; // Fallback to raw content
            }

        } catch (error) {
            console.log("Service error in generating email: ", error);
            throw error;
        }
    }

    // Helper method to create a default template
    async createDefaultTemplate(recipient) {
        const templateData = {
            recipientEmail: recipient.email,
            stage: recipient.stage || 'CONTACT',
            senderCompanyContext: {
                companyName: "Adya",
                companyDescription: process.env.COMPANY_DESCRIPTION || "",
                companyWebsite: "https://adya.ai",
                productAndServices: process.env.PRODUCT_AND_SERVICES || ""
            },
            targetCompanyContext: {
                companyName: recipient.company,
                companyDescription: recipient.Description,
                industry: recipient.industry
            },
            recipientContext: {
                name: recipient.name,
                designation: recipient.designation,
                shortBio: recipient.shortBio
            },
            senderContext: {
                name: process.env.SENDER_NAME || "Saran M",
                designation: process.env.SENDER_DESIGNATION || "Chief of Communications",
                companyName: "Adya"
            }
        };

        return await PromptTemplateRepository.create(templateData);
    }

    async promptTemplateCreation() {
        try {
            // 1. Get all recipients
            const recipients = await RecipientRepository.list();
            
            // 2. Create templates for each recipient
            const templatePromises = recipients.recipients.map(async (recipient) => {
                const templateData = {
                    recipientEmail: recipient.email,
                    stage: recipient.stage,
                    senderCompanyContext: {
                        companyName: "Adya",
                        companyDescription: process.env.COMPANY_DESCRIPTION || "",
                        companyWebsite: "https://adya.ai",
                        productAndServices: process.env.PRODUCT_AND_SERVICES || ""
                    },
                    targetCompanyContext: {
                        companyName: recipient.company,
                        companyDescription: recipient.Description,
                        industry: recipient.industry
                    },
                    recipientContext: {
                        name: recipient.name,
                        designation: recipient.designation,
                        shortBio: recipient.shortBio
                    },
                    senderContext: {
                        name: process.env.SENDER_NAME || "Saran M",
                        designation: process.env.SENDER_DESIGNATION || "Chief of Communications",
                        companyName: "Adya"
                    }
                };

                // Create template
                const template = await PromptTemplateRepository.create(templateData);

                    
                return template;
            });

            // Wait for all templates to be created
            const createdTemplates = await Promise.all(templatePromises);

            return {
                totalCreated: createdTemplates.length,
                templates: createdTemplates
            };

        } catch (error) {
            console.log("Service error in prompt template creation: ", error);
            throw error;
        }
    }

    async getTemplateForRecipient(recipientEmail) {
        try{
            const template = await PromptTemplateRepository.getByEmail(recipientEmail);
            return template;
        } catch(error){
            console.log("Service error in getting prompt template: ", error);
            throw error;
        }
    }
}

export default EmailGenerationService;
