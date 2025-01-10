


const PROMPT_TEMPLATES = {
    contact: ``,

    lead: ``,

    deal: ``,

    account: ``
};

export const getPromptForStage = (stage) => {
    const prompt = PROMPT_TEMPLATES[stage.toLowerCase()];
    if (!prompt) {
        throw new Error(`Invalid stage: ${stage}. Available stages are: contact, lead, deal, account`);
    }
    return prompt;
};

