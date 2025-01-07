import fs from 'fs/promises';
import fetch from 'node-fetch';

const ourCompanyLink = {
    website: "https://adya.ai/"
};

async function callOllama(prompt) {
    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "gemma2",
                prompt: prompt,
                stream: false
            })
        });

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error calling Ollama:', error);
        throw error;
    }
}

async function generateEmailsFromJsonList(jsonList, addPrompt) {
    const allResults = [];

    for (const companyData of jsonList) {
        console.log('Company Data', companyData);
        const companyName = companyData.name;
        const companyDescription = companyData.description?.long || "";
        const employees = companyData.employeeInfo?.employeeList || [];

        for (const emp of employees) {
            const prompt = `
                I am launching an email marketing campaign for the products of my company. Your job is to draft personalized emails by taking into account the following details:
                    1. Name of our company: Adya
                    2. Info on our products: Vanij is an enterprise-grade AI orchestration platform featuring a robust 4-layer architecture for building custom LLMs, agents, and copilots. It enables rapid development of AI applications with powerful LLM integrations, customizable workflows, and flexible cloud deployment options. Adya complements this by providing ONDC integration solutions and specialized agents for commerce operations. Together, they deliver scalable, secure AI solutions for businesses seeking digital transformation, with Vanij handling core AI capabilities and Adya focusing on network integration and commerce applications.
                    3. Target Company Name: ${companyName}
                    4. Target company description: ${companyDescription}
                    5. Name of the contact in the target company: ${emp.name}
                    6. Designation of the contact person in the target company: ${emp.designation}
                    7. Short bio of the contact person in the target company: ${emp.shortBio || ""}
                    8. My Name: Saran
                    9. My Designation at Our company: Chief of Communications
                    10. Add an link that should point to our company website link: ${ourCompanyLink.website}
                    ${addPrompt}
                
                Make it sound natural and professional. Format the email body in valid HTML.
                No need extra explanations and key points.
                Return only the valid email JSON string with fields "Subject" and "Body".
                
                Example: '{"subject": "Leave Letter", "body": "<p>I am unable to work today due to fever.</p>"}'
            `;

            const startTime = performance.now();
            const email = await callOllama(prompt);
            
            allResults.push({
                name: emp.name,
                role: emp.designation,
                company: companyName,
                company_description: companyDescription,
                generated_email: email.replace(/json|```/g, '')
            });

            const endTime = performance.now();
            console.log(`For each record: ${(endTime - startTime) / 1000}s, ${email}`);
        }
    }
    return allResults;
}

export { generateEmailsFromJsonList };