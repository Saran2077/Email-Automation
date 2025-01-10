const PROMPT_TEMPLATES = (stage, baseContext) => {
    if (stage === 'CONTACT') return `
      As an expert email copywriter, craft an initial outreach email for a first-time contact.

      ${baseContext}

      SPECIFIC GUIDELINES FOR CONTACT STAGE:
      1. Start with a compelling hook related to ${companyData?.industry || 'their industry'} trends or challenges
      2. Briefly introduce yourself and establish credibility
      3. Show you've done research about ${companyData?.companyName}
      4. Focus on their potential pain points based on their industry/role
      5. Include 1-2 relevant customer success stories or metrics
      6. End with a soft call-to-action (request for 15-min chat)
      7. Keep the email under 200 words
      
      TONE GUIDELINES:
      - Professional yet conversational
      - Show genuine interest in their business
      - Avoid aggressive sales language
      - Focus on value-addition rather than selling
    `

    if (stage === 'LEAD') return `
      As an expert email copywriter, craft a nurturing email for a qualified lead who has shown interest.

      ${baseContext}

      SPECIFIC GUIDELINES FOR LEAD STAGE:
      1. Reference previous interactions or touchpoints
      2. Address specific pain points discussed
      3. Share relevant case studies or success metrics
      4. Provide valuable insights or resources
      5. Include social proof (testimonials, reviews)
      6. Mention any current promotions or special offers
      7. Add urgency without being pushy
      8. Suggest next steps (demo, consultation, trial)
      
      TONE GUIDELINES:
      - Confident and knowledgeable
      - Solution-focused
      - Build trust through expertise
      - Maintain professional warmth
    `

    if (stage === 'DEAL') return `
      As an expert email copywriter, craft a strategic email for an opportunity in active negotiation.

      ${baseContext}

      SPECIFIC GUIDELINES FOR DEAL STAGE:
      1. Reference specific discussions and agreed points
      2. Address any pending concerns or objections
      3. Highlight key differentiators from competitors
      4. Emphasize ROI and value proposition
      5. Include implementation timeline if relevant
      6. Mention available support and resources
      7. Clear next steps for closing the deal
      8. Add any time-sensitive incentives
      
      TONE GUIDELINES:
      - Direct and clear
      - Focus on partnership
      - Emphasize mutual benefits
      - Professional but familiar
    `

    if(stage === 'ACCOUNT') return `
      As an expert email copywriter, craft a relationship-building email for an existing account.

      ${baseContext}

      SPECIFIC GUIDELINES FOR ACCOUNT STAGE:
      1. Reference current implementation/usage
      2. Share relevant updates or new features
      3. Suggest optimization opportunities
      4. Include success metrics from their account
      5. Mention expansion opportunities
      6. Offer additional training or resources
      7. Request feedback or testimonials
      8. Schedule regular check-ins
      
      TONE GUIDELINES:
      - Friendly and collaborative
      - Focus on long-term partnership
      - Proactive and helpful
      - Appreciation for their business
    `
  };

export const getPromptForStage = (stage, target_data) => {
    const our_data = {
        name: "Saran M",
        designation: "Chief of Communications",
        companyName: "Adya",
        companyDescription: `
            We are pioneers in technological innovation, seamlessly blending artificial intelligence with open networks to revolutionize business transformation. At Adya, we don't just implement technology – we architect solutions that define the future of business.
            ##Our Distinction:
            We deliver cutting-edge solutions built on two core pillars:

                1. Composable Solutions: Flexible, modular designs that adapt to your evolving needs
                2. Intelligent Integration: Seamless fusion of AI capabilities with existing infrastructure

            In a world where digital transformation is crucial, we stand as your strategic partner, equipped with the expertise to turn technological complexity into business advantage. Our solutions don't just solve today's challenges – they build the foundation for tomorrow's success.
        `,
        productDescription: "Vanij is an enterprise-grade AI orchestration platform featuring a robust 4-layer architecture for building custom LLMs, agents, and copilots. It enables rapid development of AI applications with powerful LLM integrations, customizable workflows, and flexible cloud deployment options. Adya complements this by providing ONDC integration solutions and specialized agents for commerce operations. Together, they deliver scalable, secure AI solutions for businesses seeking digital transformation, with Vanij handling core AI capabilities and Adya focusing on network integration and commerce applications.",
        website: "https://adya.ai/"
    }

    const baseContext = `
        COMPANY CONTEXT:
        - Our Company: ${our_data?.companyName}
        - Our Value Proposition: ${our_data?.companyDescription}
        - Our Website: ${our_data?.website}
        
        TARGET CONTEXT:
        - Company: ${target_data?.companyName}
        - Company Profile: ${target_data?.companyDescription}
        - Industry: ${target_data?.industry || ''}
        
        RECIPIENT CONTEXT:
        - Name: ${target_data?.name}
        - Role: ${target_data?.designation}
        - Background: ${target_data?.shortBio || ''}
        
        SENDER DETAILS:
        - Name: ${our_data?.name}
        - Role: ${our_data?.designation}
        - Company Name: ${our_data?.companyName}
  `;

    const prompt = `
        ${PROMPT_TEMPLATES(stage.toUpperCase(), baseContext)}

        General Requirements:
        1. Use clean, professional HTML formatting
        2. Include our website link naturally: ${our_data?.website}
        3. Add appropriate spacing and paragraphs
        4. Include a professional email signature
        5. Ensure mobile-friendly formatting

        Return only a valid JSON string with format:
        {
        "subject": "Compelling subject line",
        "body": "HTML formatted email body"
        }
    `
    if (!prompt) {
        throw new Error(`Invalid stage: ${stage}. Available stages are: contact, lead, deal, account`);
    }
    return prompt;
};

