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

export const getPromptForStage = ({ stage, contextData, customContext, aiPrompt = '', customInstructions = '' }) => {
    // Deep clone the contextData to avoid mutations
    let finalContext = JSON.parse(JSON.stringify(contextData));
    
    if (customContext) {
        finalContext = mergeCustomContext(finalContext, customContext);
    }

    const baseContext = buildBaseContext(finalContext);
    const stageTemplate = buildStageTemplate(stage);
    const defaultPrompt = `
        1. Include our website link naturally: adya.ai
        2. Add appropriate spacing and paragraphs
        3. Include a professional email signature
        4. Ensure mobile-friendly formatting
        ${customInstructions ? `\nAdditional Instructions:\n${customInstructions}` : ''}
    `;

    return `
        ${stageTemplate}

        ${baseContext}

        User's Prompt:
        ${defaultPrompt}

        General Requirements:
        1. Make it sound natural and professional. Format the email body in valid HTML. 
        2. Return only a valid JSON string with format:
        {
            "subject": "Compelling subject line",
            "body": "HTML formatted email body"
        }
        3. Keep it short and concise.
        4. Use the company name and website in the email naturally.
    `;
};

// Helper function to get context structure for frontend
export const getContextStructure = () => CONTEXT_STRUCTURE;

