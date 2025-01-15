// Template constants
const STAGE_TEMPLATES = {
    CONTACT: {
        role: "As an expert email copywriter, craft an initial outreach email for a first-time contact.",
        guidelines: [
            "Start with a compelling hook related to their industry trends or challenges",
            "Briefly introduce yourself and establish credibility",
            "Show you've done research about that company",
            "Focus on their potential pain points based on their industry/role",
            "End with a soft call-to-action (request for 15-min chat)",
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

export const getPromptForStage = ({ stage, contextData, customContext, customPrompt=null, aiPrompt = '', customInstructions = '' }) => {
    // Deep clone the contextData to avoid mutations
    let finalContext = JSON.parse(JSON.stringify(contextData));
    
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

        ${baseContext}

        User's Prompt:
        ${defaultPrompt}

        General Requirements:
        1. The email should be natural, professional, and engaging, with no placeholders or templated words like [signature] or [name]. Format the email body in valid HTML.
        2. Return only a valid JSON string with this structure:
        {
            "subject": "Compelling subject line",
            "body": "HTML formatted email body"
        }
        3. Keep the email short, concise, and impactful.
        4. Use the company name and website naturally within the email body.
        5. Do not include any explanations or additional output—return only the JSON.
    `;
};

// Helper function to get context structure for frontend
export const getContextStructure = () => CONTEXT_STRUCTURE;

