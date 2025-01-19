// Template constants
import axios from 'axios';

const STAGE_TEMPLATES = {
    CONTACT: {
        role: "As an expert email copywriter, craft an initial outreach email for a first-time contact.",
        guidelines: [
            "Start with a compelling hook related to their industry trends or challenges",
            "Briefly introduce yourself and establish credibility",
            "Show you've done research about that company with the help of the context COMPANY_RESEARCH_DATA",
            "Focus on their potential pain points based on their industry/role using the context TECHNOLOGY_CHALLENGES",
            "End with a soft call-to-action",
            "Keep the email under 200 words"
        ],
        tone: [
            "Professional yet conversational",
            "Show genuine interest in their business",
            "Avoid aggressive sales language",
            "Focus on value-addition rather than selling"
        ]
    },
    LEAD: {
        role: "As a strategic sales consultant, create a follow-up communication for a qualified lead who has shown interest.",
        guidelines: [
            "Reference specific points from previous interactions",
            "Address identified pain points with concrete solutions",
            "Include relevant case studies or success stories",
            "Provide clear next steps in the evaluation process",
            "Suggest a detailed discovery call or demo",
            "Include specific value propositions aligned with their needs"
        ],
        tone: [
            "Confident and knowledgeable",
            "Solution-oriented",
            "Build on established rapport",
            "Maintain professional enthusiasm"
        ]
    },
    DEAL: {
        role: "As a senior sales strategist, draft a proposal follow-up for an active deal in negotiation.",
        guidelines: [
            "Summarize key points from the proposal",
            "Address any concerns or objections raised",
            "Highlight ROI and specific business benefits",
            "Include timeline and implementation details",
            "Present clear pricing and package options",
            "Outline immediate next steps for closing"
        ],
        tone: [
            "Direct and clear",
            "Emphasize partnership approach",
            "Focus on mutual success",
            "Create sense of momentum"
        ]
    },
    ACCOUNT: {
        role: "As an account management expert, create communication for nurturing an existing client relationship.",
        guidelines: [
            "Review current usage and success metrics",
            "Suggest optimization opportunities",
            "Share relevant product updates or new features",
            "Propose expansion opportunities",
            "Include industry insights and best practices",
            "Schedule quarterly business review"
        ],
        tone: [
            "Collaborative and consultative",
            "Long-term relationship focused",
            "Proactive and strategic",
            "Demonstrate ongoing value"
        ]
    }
};

// Context structure definition
const CONTEXT_STRUCTURE = {
    COMPANY: ['companyName', 'companyDescription', 'companyWebsite', 'productAndServices'],
    TARGET: ['companyName', 'companyDescription', 'industry'],
    RECIPIENT: ['name', 'designation', 'shortBio'],
    SENDER: ['name', 'designation', 'companyName']
};

const AI_USE_CASES = {
    "Retail (Seller-focused)": [
        "Inventory Management",
        "Agent Pricing Optimization",
        "Agent Market Intelligence",
        "Agent Supplier Relationship",
        "Agent Product Listing Optimization",
        "Agent Sales Forecasting",
        "Agent Customer Feedback Analysis",
        "Agent Competition Monitoring",
        "Agent Visual Merchandising",
        "Agent Returns/Refund Processing",
    ],
    "Retail (Buyer-focused)": [
        "Personal Shopping Assistant",
        "Product Discovery Agent",
        "Size/Fit Recommendation Agent",
        "Style Advisory Agent",
        "Price Comparison Agent",
        "Loyalty Program Assistant",
        "Gift Recommendation Agent",
        "Order Tracking Assistant",
        "Product Review Analysis Agent",
        "Shopping List Optimization Agent"
    ],
    "Fast Moving Consumer Goods (FMCG)": [
        "Demand Forecasting Agent",
        "Distribution Network Optimizer",
        "Trade Promotion Agent",
        "Market Share Analysis Agent",
        "Consumer Behavior Analyst",
        "Product Launch Assistant",
        "Brand Monitoring Agent",
        "Shelf Space Optimization Agent",
        "Stock Replenishment Agent",
        "Campaign Performance Analyzer",
        "Documentation Generator",
        "API Integration Assistant",
        "Security Vulnerability Scanner",
        "System Architecture Advisor",
        "Performance Optimization Agent",
        "Test Case Generator"
    ],
    "Finance": [
        "Fraud Detection Agent",
        "Credit Risk Assessment Agent",
        "Trading Strategy Assistant",
        "Portfolio Rebalancing Agent",
        "Regulatory Compliance Monitor",
        "Transaction Anomaly Detector",
        "Financial Planning Assistant",
        "Market Analysis Agent",
        "Cash Flow Forecasting Agent",
        "Debt Collection Assistant",
        "Expense Classification Agent",
        "Audit Assistant",
        "Tax Compliance Monitor",
        "Journal Entry Validator",
        "Financial Statement Analyzer",
        "Invoice Processing Agent",
        "Reconciliation Assistant",
        "Budget Planning Agent",
        "Revenue Recognition Assistant",
        "Fixed Asset Management Agent"
    ],
    "Insurance": [
        "Claims Processing Agent",
        "Risk Assessment Agent",
        "Policy Recommendation Agent",
        "Fraud Detection Assistant",
        "Customer Service Agent",
        "Premium Calculation Agent",
        "Document Verification Agent",
        "Underwriting Assistant",
        "Policy Renewal Agent",
        "Claims Investigation Agent"
    ],
    "Manufacturing": [
        "Predictive Maintenance Agent",
        "Quality Control Assistant",
        "Production Scheduling Agent",
        "Inventory Optimization Agent",
        "Equipment Monitoring Agent",
        "Supply Chain Assistant",
        "Safety Compliance Monitor",
        "Process Optimization Agent",
        "Defect Detection Assistant",
        "Energy Usage Optimizer"
    ],
    "HR": [
        "AI Self-Assessment Agent",
        "AI Profile Summarization Agent",
        "AI Video Interview Agent",
        "AI Search Optimization Agent",
        "Conversational Interface Agent for Recruiters",
        "AI Q & A Analysis Agent"
    ]
};

const formatContextSection = (contextData, section) => {
    if (!contextData) return '';
    
    // Get all keys from the context data, not just the predefined ones
    const lines = Object.entries(contextData)
        .map(([key, value]) => `- ${key}: ${value || ''}`)
        .join('\n');
    
    return lines ? `${section} CONTEXT:\n${lines}\n` : '';
};

// Update the context structure to be more flexible
const CONTEXT_MAPPING = {
    senderCompanyContext: 'COMPANY',
    targetCompanyContext: 'TARGET',
    recipientContext: 'RECIPIENT',
    senderContext: 'SENDER'
};

const buildBaseContext = (contextData) => {
    return Object.entries(CONTEXT_MAPPING)
        .map(([contextKey, section]) => {
            const sectionData = contextData[contextKey];
            return formatContextSection(sectionData, section);
        })
        .filter(Boolean)
        .join('\n');
};

const mergeCustomContext = (baseContext, customContext) => {
    if (!customContext) return baseContext;

    const mergedContext = { ...baseContext };
    
    Object.entries(customContext).forEach(([sectionKey, sectionData]) => {
        if (typeof sectionData === 'object' && sectionData !== null) {
            // Create section if it doesn't exist
            if (!mergedContext[sectionKey]) {
                mergedContext[sectionKey] = {};
            }
            // Deep merge the section data
            mergedContext[sectionKey] = {
                ...mergedContext[sectionKey],
                ...sectionData
            };
        }
    });
    
    return mergedContext;
};

const buildStageTemplate = (stage) => {
    const template = STAGE_TEMPLATES[stage.toUpperCase()];
    if (!template) {
        throw new Error(`Invalid stage: ${stage}. Available stages are: ${Object.keys(STAGE_TEMPLATES).join(', ')}`);
    }

    return `
        ${template.role}

        SPECIFIC GUIDELINES FOR ${stage.toUpperCase()} STAGE:
        ${template.guidelines.map((g, i) => `${i + 1}. ${g}`).join('\n')}
        
        TONE GUIDELINES:
        ${template.tone.map(t => `- ${t}`).join('\n')}
    `;
};

export const getPromptForStage = async ({ stage, contextData, customContext, customPrompt=null, aiPrompt = '', customInstructions = '' }, companyDomain, companyDescription, industry, companyName) => {
    // Deep clone the contextData to avoid mutations
    console.log("company domain::", companyDomain)
    let finalContext = JSON.parse(JSON.stringify(contextData))
    let companyResearchData;
    let technologyChallengesData;

    // if(companyDomain) {
    //    //make mcp api calls to get the internet extracted data
    //    try {
    //     const companyResearchPayload = {
    //       "query": `Investigate if the company referred to as ${companyName} has been investing in AI. 
    //         Research method: 
    //             1. Search for news articles, press releases, or official statements from ${companyDomain} and the company's LinkedIn profile using terms like \"AI investment\", \"artificial intelligence investment\", \"AI acquisition\", or \"AI partnership\".
    //             2. If insufficient information is found, expand the search to credible business and tech news sites. Data to be retrieved: 1. Evidence of AI investment (e.g., investment amounts, AI-related projects, partnerships) 2. Dates and sources of any mentions 3. Relevant quotes or statements Provide findings including \"evidence\", \"date\", \"source\", and \"quote\".  
    //         `
    //     }

    //     const technologyChallengesPayload = {
    //       "query": `Act as a specialized company analyst. Based on domain in the column ${companyDomain} perform a detailed search for issues or challenges related to technology specific to the company or industry level (${industry}), avoiding large macro policy issues and government-related topics.
    //         Research steps:
    //             1. Search the company domain and news articles.
    //             2. Look for technology-related challenges or issues reported by the company, industry forums, or people associated with it.
    //             3. Confirm information credibility by cross-referencing different sources.
    //             4. Focus on recent and localized content, avoiding broad national or policy-related discussions.
    //             Present the data in the format including:
    //             1. Description of the issue
    //             2. Source URL
    //             3. Date (if available)
    //             4. Context or quote from the source
    //             In case no relevant data is found, respond with 'No specific technology issues found for ${companyDomain}'`
    //     }

    //     const companyResearchResult = await axios.post(`https://a7f9-2001-4490-4e81-af15-1925-5995-e016-79c1.ngrok-free.app/process_query`, companyResearchPayload)
    //     if (companyResearchResult?.data?.status === 'success') {
    //         companyResearchData = companyResearchResult.data.result;
    //     }

    //     const technologyChallengesResult = await axios.post(`https://a7f9-2001-4490-4e81-af15-1925-5995-e016-79c1.ngrok-free.app/process_query`, technologyChallengesPayload)
    //     if (technologyChallengesResult?.data?.status === 'success') {
    //         technologyChallengesData = technologyChallengesResult.data.result;
    //     }


    //    } catch (error) {
    //     console.error("Error calling MCP API: ", error)
    //     throw error;
    //    }

    // }

    // let finalContext = JSON.parse(JSON.stringify(contextData));
    
    if (customContext) {
        finalContext = mergeCustomContext(finalContext, customContext);
    }

    console.log(finalContext)
    console.log(customContext)

    const baseContext = buildBaseContext(finalContext);
    const stageTemplate = buildStageTemplate(stage);
    const defaultPrompt = `
        1. Include the company website link naturally: https://adya.ai
        2. Use appropriate spacing and clear paragraph formatting for readability.
        3. Add a professional email signature with the sender's name, title, and company name.
        4. Ensure the email is mobile-friendly with concise, valid HTML formatting.
        ${customInstructions ? `\nAdditional Instructions:\n${customInstructions}` : ''}
    `;

    return `
        ${customPrompt ? customPrompt?.content : stageTemplate}

        ${companyResearchData ? `
        COMPANY_RESEARCH_DATA:
        ${companyResearchData}
        ` : ''}

        ${technologyChallengesData ? `
        TECHNOLOGY_CHALLENGES:
        ${technologyChallengesData}
        ` : ''}

        ${baseContext}

        User's Prompt:
        ${defaultPrompt}

        ##AI Use Cases:
         Identify the industry and nature of the business. Identify the likely use cases the company would have for an AI agent or copilot.
         Include those company specific AI use cases also in the email body.
         Below are some example usecases across different industries:
         ${JSON.stringify(AI_USE_CASES)}
         Do not limit the use cases to just the ones mentioned above, these are just thought starters.
         Please provide a list of 5 to 6 likely AI Agent or Copilots for each line item. Make them unique and highly pertinent and relevant to this company and industry


        ##AI Benefit Metrics:
           Using the industry and nature of the business, identify the likely BENEFITS of using an AI agent or copilot in the identified AI Use Cases.
           Include the benefits too in the email body.
            Focus on these key benefit areas:
            - Operational improvements (e.g., 24/7 automated service delivery)
            - Business impact (e.g., higher customer satisfaction)
            - Productivity gains (e.g., reduced manual processing time)
            (Do not limit the benefits to just the ones mentioned above, these are just thought starters.)

            Examples of typical benefits:
            - Operational: 24/7 automated service delivery, faster response times
            - Business: Higher customer satisfaction, increased retention rates
            - Productivity: Reduced processing time for routine tasks, lower error rates

            Important:
            - Focus on describing qualitative benefits
            - Use general improvement terms (significant, substantial, noticeable)
            - Do not quote specific research studies or percentage improvements
            - Do not fabricate or specify exact metrics
        
        ##Technology Challenges:
           Identify the likely Technology Challenges that the company may face using the company's nature and industry.
           Identify how that can be overcome using the AI agent or copilot.
           Include the challenges and how they can be overcome in the email body.

        ##NOTE:
           Include all the above sections into the email body seamlessly and naturally, while keeping the email short, concise, and impactful.

        ## General Requirements:
        1. The email should be natural, professional, and engaging, with no placeholders or templated words like [signature] or [name]. Format the email body in valid HTML.
        2. Return only a valid **JSON object** (not a stringified or escaped JSON) with this exact structure:
        {
            "subject": "Compelling subject line",
            "body": "HTML formatted email body"
        }
        3. Do not wrap the JSON object in any additional keys (e.g., 'body' or 'data') or include extra text, escape sequences ('\n', '+'), or explanations.
        4. Ensure the email body does not exceed 300 words.
        5. The JSON must be valid and directly parsable—no extra formatting or characters outside the JSON structure.


    `;
};

// Helper function to get context structure for frontend
export const getContextStructure = () => CONTEXT_STRUCTURE;

