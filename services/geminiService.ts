import { GoogleGenAI, Type, Schema } from "@google/genai";
import { BusinessIdea, BusinessCanvas, BusinessDetails, UserProfile, Language, StressTestAnalysis, FinancialEstimates, Roadmap, SourcingLink, CreditRiskReport, LoanApplication, PitchDeck, FundingMilestone, SimulationEvent } from "../types";
import { fetchMachineImage } from "./googleSearchService";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for generating Business Ideas
const businessIdeaSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      machineName: { type: Type.STRING, description: "Specific name of the machine or system found on Amazon/Alibaba" },
      businessTitle: { type: Type.STRING, description: "Catchy title for the small business" },
      description: { type: Type.STRING, description: "How the machine is used to make money. Must be at least two sentences long." },
      priceRange: { type: Type.STRING, description: "Estimated cost of the machine e.g. $2,000 - $5,000" },
      platformSource: { type: Type.STRING, enum: ['Alibaba', 'Amazon', 'Global Sources'] },
      potentialRevenue: { type: Type.STRING, description: "Brief revenue potential estimation" }
    },
    required: ["id", "machineName", "businessTitle", "description", "priceRange", "platformSource", "potentialRevenue"],
    propertyOrdering: ["id", "machineName", "businessTitle", "description", "priceRange", "platformSource", "potentialRevenue"]
  }
};

// Schema for Business Details
const businessDetailsSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    targetAudience: { type: Type.STRING, description: "Who are the customers?" },
    operationalRequirements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 key things needed to run it (space, power, license)" },
    skillRequirements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 key skills needed to operate the business" },
    pros: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 Advantages" },
    cons: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 Challenges" },
    marketingQuickTip: { type: Type.STRING, description: "One actionable marketing tip" }
  },
  required: ["targetAudience", "operationalRequirements", "skillRequirements", "pros", "cons", "marketingQuickTip"]
};

// Schema for Stress Test
const stressTestSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    saturationLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
    saturationReason: { type: Type.STRING, description: "Brief explanation of saturation level" },
    hiddenCosts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 unexpected costs usually forgotten" },
    failureMode: { type: Type.STRING, description: "The #1 specific reason this business fails" },
    competitorEdge: { type: Type.STRING, description: "One tactic to beat established players" }
  },
  required: ["saturationLevel", "saturationReason", "hiddenCosts", "failureMode", "competitorEdge"]
};

// Schema for Financial Estimates
const financialEstimatesSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    initialInvestment: { type: Type.NUMBER, description: "Total startup cost in USD (machine + permit + first month rent)" },
    monthlyFixedCosts: { type: Type.NUMBER, description: "Rent, insurance, marketing in USD" },
    costPerUnit: { type: Type.NUMBER, description: "Variable cost to produce one unit in USD (material + energy)" },
    pricePerUnit: { type: Type.NUMBER, description: "Selling price for one unit in USD" },
    estimatedMonthlySales: { type: Type.NUMBER, description: "Conservative number of units sold per month for a beginner" },
    currency: { type: Type.STRING, description: "Currency symbol, usually $" }
  },
  required: ["initialInvestment", "monthlyFixedCosts", "costPerUnit", "pricePerUnit", "estimatedMonthlySales", "currency"]
};

// Schema for Funding Milestones
const fundingMilestonesSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      phaseName: { type: Type.STRING, description: "Name of the funding phase (e.g. Procurement)" },
      description: { type: Type.STRING, description: "What the funds will be used for in this phase" },
      amount: { type: Type.NUMBER, description: "Amount needed for this specific phase in USD" }
    },
    required: ["phaseName", "description", "amount"]
  }
};

// Schema for Credit Risk Report
const creditRiskSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER, description: "Credit score 0-100" },
    riskLevel: { type: Type.STRING, enum: ['Low', 'Moderate', 'High', 'Critical'] },
    dscr: { type: Type.NUMBER, description: "Debt Service Coverage Ratio (e.g. 1.25)" },
    ltv: { type: Type.NUMBER, description: "Loan to Value ratio percentage (e.g. 80)" },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 key strengths of the application" },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 key weaknesses or risks" },
    stipulations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Conditions for approval (e.g. higher down payment)" },
    verdict: { type: Type.STRING, enum: ['Approved', 'Conditional', 'Rejected'] },
    maxLoanAmount: { type: Type.NUMBER, description: "Maximum recommended loan amount in USD" }
  },
  required: ["score", "riskLevel", "dscr", "ltv", "strengths", "weaknesses", "stipulations", "verdict", "maxLoanAmount"]
};

// Schema for Roadmap
const roadmapSchema: Schema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            phaseName: { type: Type.STRING, description: "Name of the phase, e.g. 'Month 1: Setup'"},
            duration: { type: Type.STRING, description: "Duration, e.g. 'Week 1-4'"},
            steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 3 specific actionable tasks for this phase" }
        },
        required: ["phaseName", "duration", "steps"]
    }
}

// Schema for Pitch Deck
const pitchDeckSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    slides: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Slide Title (e.g., The Problem)" },
          subtitle: { type: Type.STRING, description: "A punchy subtitle or statistic" },
          bullets: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 concise points" }
        },
        required: ["title", "subtitle", "bullets"]
      }
    }
  },
  required: ["slides"]
};

// Schema for Business Canvas
const canvasSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    keyPartners: { type: Type.ARRAY, items: { type: Type.STRING } },
    keyActivities: { type: Type.ARRAY, items: { type: Type.STRING } },
    keyResources: { type: Type.ARRAY, items: { type: Type.STRING } },
    valuePropositions: { type: Type.ARRAY, items: { type: Type.STRING } },
    customerRelationships: { type: Type.ARRAY, items: { type: Type.STRING } },
    channels: { type: Type.ARRAY, items: { type: Type.STRING } },
    customerSegments: { type: Type.ARRAY, items: { type: Type.STRING } },
    costStructure: { type: Type.ARRAY, items: { type: Type.STRING } },
    revenueStreams: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: [
    "keyPartners", "keyActivities", "keyResources", "valuePropositions", 
    "customerRelationships", "channels", "customerSegments", "costStructure", "revenueStreams"
  ]
};

// Schema for Simulation Event
const simulationEventSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        scenario: { type: Type.STRING, description: "A situational crisis or opportunity description." },
        choices: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, enum: ["a", "b", "c"] },
                    label: { type: Type.STRING, description: "Short button label" },
                    description: { type: Type.STRING, description: "Explanation of the choice risk/reward" },
                    cashImpact: { type: Type.NUMBER, description: "Projected cash change (negative for cost, positive for gain)" },
                    moraleImpact: { type: Type.NUMBER, description: "Projected morale change (-10 to +10)" },
                    outcomeText: { type: Type.STRING, description: "What happens after this choice is made" }
                },
                required: ["id", "label", "description", "cashImpact", "moraleImpact", "outcomeText"]
            }
        }
    },
    required: ["scenario", "choices"]
};

export const generateIdeas = async (industry: string, language: Language): Promise<BusinessIdea[]> => {
  try {
    const langInstruction = language === 'am' 
      ? "IMPORTANT: Provide all text content (machineName, businessTitle, description, potentialRevenue) in Amharic language. Keep the price range with currency but you can translate descriptions of price. Keep the JSON structure and keys in English."
      : "Provide content in English.";

    const prompt = `
      I am an entrepreneur looking for small-scale business ideas in the ${industry} industry.
      Please search your internal knowledge base for specific machines, systems, or technologies typically found on platforms like Alibaba or Amazon.
      List 6 distinct business ideas where purchasing one specific machine allows me to start a service or manufacturing business.
      Focus on machines that are accessible to small businesses (under $50,000 investment).
      For each, provide the machine name, a business title, price range, and likely source.
      
      IMPORTANT: The 'description' field must be detailed and AT LEAST TWO SENTENCES long, explaining exactly how the machine generates revenue.
      
      ${langInstruction}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: businessIdeaSchema,
        temperature: 0.7,
      }
    });

    if (response.text) {
      const ideas = JSON.parse(response.text) as BusinessIdea[];
      
      // Enhance ideas with real images from Google Search
      const ideasWithImages = await Promise.all(ideas.map(async (idea) => {
         const imageUrl = await fetchMachineImage(idea.machineName);
         return { ...idea, imageUrl };
      }));

      return ideasWithImages;
    }
    return [];
  } catch (error) {
    console.error("Error generating ideas:", error);
    return [];
  }
};

export const generatePersonalizedIdeas = async (profile: UserProfile, language: Language): Promise<BusinessIdea[]> => {
  try {
    const langInstruction = language === 'am' 
      ? "IMPORTANT: Provide all text content in Amharic language. Keep the JSON structure and keys in English."
      : "Provide content in English.";

    const prompt = `
      Act as a business consultant. Analyze the following user profile and recommend 6 personalized small business ideas based on machines/technologies available on Alibaba/Amazon.
      
      User Profile:
      - Budget: ${profile.budget}
      - Skills: ${profile.skills}
      - Interests: ${profile.interests}
      - Education: ${profile.education || 'Not specified'}
      - Experience: ${profile.experience || 'Not specified'}
      - Risk Tolerance: ${profile.riskTolerance}
      - Time Commitment: ${profile.timeCommitment}

      Constraints:
      1. Ideas must involve buying a specific machine or system to start the business.
      2. The machine cost must fit within or near the user's budget.
      3. The business should align with their skills, interests, and professional background.
      4. The 'description' field must be detailed and AT LEAST TWO SENTENCES long.
      
      ${langInstruction}
      Output 6 distinct ideas.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: businessIdeaSchema,
        temperature: 0.7,
      }
    });

    if (response.text) {
      const ideas = JSON.parse(response.text) as BusinessIdea[];

      // Enhance ideas with real images from Google Search
      const ideasWithImages = await Promise.all(ideas.map(async (idea) => {
         const imageUrl = await fetchMachineImage(idea.machineName);
         return { ...idea, imageUrl };
      }));

      return ideasWithImages;
    }
    return [];
  } catch (error) {
    console.error("Error generating personalized ideas:", error);
    return [];
  }
};

export const generateBusinessDetails = async (idea: BusinessIdea, language: Language): Promise<BusinessDetails | null> => {
  try {
    const langInstruction = language === 'am' 
      ? "IMPORTANT: Provide all text content in Amharic language. Keep the JSON structure and keys in English."
      : "Provide content in English.";

    const prompt = `
      Provide a brief operational analysis for this business idea:
      Business: ${idea.businessTitle}
      Machine: ${idea.machineName}
      Description: ${idea.description}

      Required Output:
      1. Target Audience (Who buys this?)
      2. Operational Requirements (3 short bullet points, e.g. Space, Power, License)
      3. Skill Requirements (3 short bullet points, e.g. Welding, Design, Sales)
      4. 3 Key Pros
      5. 3 Key Cons
      6. 1 Marketing Quick Tip

      ${langInstruction}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: businessDetailsSchema,
        temperature: 0.7,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as BusinessDetails;
    }
    return null;
  } catch (error) {
    console.error("Error generating details:", error);
    return null;
  }
};

export const generateStressTest = async (idea: BusinessIdea, language: Language): Promise<StressTestAnalysis | null> => {
  try {
    const langInstruction = language === 'am' 
      ? "IMPORTANT: Provide all text content in Amharic language. Keep the JSON structure and keys in English."
      : "Provide content in English.";

    const prompt = `
      Act as a skeptical venture capitalist and risk analyst. 
      Perform a stress test/failure simulation on this business idea:
      Business: ${idea.businessTitle}
      Machine: ${idea.machineName}
      Description: ${idea.description}

      Provide a critical analysis identifying:
      1. Market Saturation (Low, Medium, or High) and why.
      2. Hidden Operational Costs (3 things people forget).
      3. Critical Failure Mode (The #1 reason this business dies).
      4. Competitive Edge (How to survive).

      ${langInstruction}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: stressTestSchema,
        temperature: 0.8, // Slightly higher for more creative critical thinking
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as StressTestAnalysis;
    }
    return null;
  } catch (error) {
    console.error("Error generating stress test:", error);
    return null;
  }
};

export const generateFinancialEstimates = async (idea: BusinessIdea, language: Language): Promise<FinancialEstimates | null> => {
  try {
    // Financials usually stay in numbers, so language mostly affects the currency context if needed, 
    // but the schema asks for specific numbers.
    const prompt = `
      Act as a financial analyst. Estimate conservative financial figures for this small business idea:
      Business: ${idea.businessTitle}
      Machine: ${idea.machineName}
      Description: ${idea.description}

      Provide realistic estimates for:
      1. Initial Investment (Machine cost + ~$500 setup).
      2. Monthly Fixed Costs (Rent, simple marketing, utilities).
      3. Cost Per Unit (Material + Labor/Energy).
      4. Selling Price Per Unit (Market average).
      5. Estimated Monthly Sales (Conservative volume for a beginner).

      Return numeric values in USD.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: financialEstimatesSchema,
        temperature: 0.5, // Lower temperature for more consistent numbers
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as FinancialEstimates;
    }
    return null;
  } catch (error) {
    console.error("Error generating financial estimates:", error);
    return null;
  }
};

export const generateFundingMilestones = async (
    idea: BusinessIdea, 
    totalBudget: number, 
    language: Language
): Promise<FundingMilestone[] | null> => {
    try {
        const langInstruction = language === 'am' 
            ? "IMPORTANT: Provide 'phaseName' and 'description' in Amharic language. Keep keys in English."
            : "Provide content in English.";

        const prompt = `
            Act as a venture capital auditor. 
            I need to break down a small business loan of USD $${totalBudget} into 3 or 4 logical funding milestones/tranches to reduce risk.

            Business: ${idea.businessTitle}
            Asset: ${idea.machineName}

            Rules:
            1. The first milestone MUST be the procurement of the machine/asset.
            2. The sum of all 'amount' fields MUST equal exactly ${totalBudget}.
            3. Phases should follow logical order: Procurement -> Operations Setup -> Launch/Marketing.

            Return a JSON array of milestones.
            ${langInstruction}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: fundingMilestonesSchema,
                temperature: 0.4
            }
        });

        if (response.text) {
            const raw = JSON.parse(response.text) as any[];
            // Hydrate with client-side status and IDs
            return raw.map((m, i) => ({
                id: `ms-${Date.now()}-${i}`,
                phaseName: m.phaseName,
                description: m.description,
                amount: m.amount,
                status: i === 0 ? 'Released' : (i === 1 ? 'Pending' : 'Locked') // First released for simulation
            }));
        }
        return null;
    } catch (error) {
        console.error("Error generating funding milestones:", error);
        return null;
    }
};

export const generateRoadmap = async (idea: BusinessIdea, language: Language): Promise<Roadmap | null> => {
    try {
        const langInstruction = language === 'am' 
            ? "IMPORTANT: Provide all text content in Amharic language. Keep the JSON structure and keys in English."
            : "Provide content in English.";

        const prompt = `
            Act as a project manager. Create a step-by-step execution roadmap for this business:
            Business: ${idea.businessTitle}
            Machine: ${idea.machineName}
            
            Break it down into 4 phases:
            1. Sourcing & Setup (Ordering machine, location)
            2. Legal & Compliance (Permits, bank accounts)
            3. Marketing & Launch (Branding, first customers)
            4. Growth (Optimization, hiring)

            For each phase, provide:
            - A Phase Name
            - Typical Duration (e.g. Month 1)
            - 3 Specific, Actionable Steps (Checklist items)

            ${langInstruction}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: roadmapSchema,
                temperature: 0.7
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as Roadmap;
        }
        return null;

    } catch (error) {
        console.error("Error generating roadmap:", error);
        return null;
    }
};

export const findMachineSuppliers = async (machineName: string): Promise<SourcingLink[]> => {
  try {
    const prompt = `Find current purchasing links for "${machineName}" on major B2B and B2C platforms like Alibaba, Amazon, Indiamart, eBay, or AliExpress. Focus on finding actual product listings if possible.`;
    
    // IMPORTANT: Do NOT set responseMimeType or responseSchema when using Google Search Grounding.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2
      }
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract unique links
    const uniqueLinks = new Map<string, SourcingLink>();
    
    chunks.forEach(chunk => {
        if (chunk.web && chunk.web.uri && chunk.web.title) {
            const url = chunk.web.uri;
            if (!uniqueLinks.has(url)) {
                // Simple hostname extraction for source name
                let source = "Web";
                try {
                    const hostname = new URL(url).hostname;
                    source = hostname.replace('www.', '');
                } catch (e) {}

                uniqueLinks.set(url, {
                    title: chunk.web.title,
                    url: url,
                    source: source
                });
            }
        }
    });

    return Array.from(uniqueLinks.values()).slice(0, 5); // Return top 5
  } catch (error) {
    console.error("Error finding machine suppliers:", error);
    return [];
  }
};

export const generateCanvas = async (idea: BusinessIdea, language: Language): Promise<BusinessCanvas | null> => {
  try {
    const langInstruction = language === 'am' 
      ? "IMPORTANT: Provide all text content in Amharic language. Keep the JSON structure and keys in English."
      : "Provide content in English.";

    const prompt = `
      Create a detailed Business Model Canvas for the following business idea:
      Machine: ${idea.machineName}
      Business: ${idea.businessTitle}
      Description: ${idea.description}
      
      ${langInstruction}
      Provide 3-5 bullet points for each section of the canvas.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: canvasSchema,
        temperature: 0.7,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as BusinessCanvas;
    }
    return null;
  } catch (error) {
    console.error("Error generating canvas:", error);
    return null;
  }
};

export const generatePitchDeck = async (idea: BusinessIdea, language: Language): Promise<PitchDeck | null> => {
    try {
        const langInstruction = language === 'am' 
            ? "IMPORTANT: Provide all text content in Amharic language. Keep the JSON structure and keys in English."
            : "Provide content in English.";

        const prompt = `
            Act as a venture capital consultant. Create a persuasive 5-slide pitch deck for this business:
            Business: ${idea.businessTitle}
            Machine: ${idea.machineName}
            Description: ${idea.description}
            Revenue Potential: ${idea.potentialRevenue}

            Generate content for exactly these 5 slides:
            1. Title Slide (Hook)
            2. The Problem & Solution
            3. Market Opportunity & Competition
            4. Business Model & Revenue
            5. The Ask & Roadmap

            For each slide, provide a Title, a Subtitle (punchy statistic or claim), and 3-4 Bullet Points.

            ${langInstruction}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: pitchDeckSchema,
                temperature: 0.7
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as PitchDeck;
        }
        return null;
    } catch (error) {
        console.error("Error generating pitch deck:", error);
        return null;
    }
};

export const generateCreditRiskReport = async (
    application: LoanApplication, 
    language: Language
): Promise<CreditRiskReport | null> => {
    try {
        const langInstruction = language === 'am' 
            ? "IMPORTANT: Provide all text content in Amharic language. Keep the JSON structure and keys in English."
            : "Provide content in English.";

        const prompt = `
            Act as a strict Senior Credit Risk Underwriter for a FinTech lender.
            Evaluate this loan application for a small business equipment loan.

            Application Details:
            - Applicant Name: ${application.applicantName}
            - Self-Reported Credit Score: ${application.creditScore}
            - Loan Amount Requested: $${application.loanAmount}
            - Down Payment: $${application.downPayment}
            
            Business Asset (Collateral):
            - Machine: ${application.businessIdea.machineName}
            - Business: ${application.businessIdea.businessTitle}
            - Description: ${application.businessIdea.description}
            - Estimated Revenue: ${application.businessIdea.potentialRevenue}

            Task:
            1. Calculate a Risk Score (0-100). 100 is perfect.
            2. Estimate DSCR (Debt Service Coverage Ratio) based on potential revenue vs loan payment.
            3. Calculate LTV (Loan to Value) based on loan amount vs approximate machine cost.
            4. Identify Strengths (Collateral value, down payment size, etc).
            5. Identify Weaknesses (Startup risk, credit score, etc).
            6. Identify Stipulations if Conditional.
            7. Provide a Verdict (Approved/Conditional/Rejected).
            8. Set Stipulations if Conditional.

            ${langInstruction}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: creditRiskSchema,
                temperature: 0.4
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as CreditRiskReport;
        }
        return null;
    } catch (error) {
        console.error("Error generating credit risk report:", error);
        return null;
    }
};

// --- SIMULATION MODE ---

export const generateSimulationEvent = async (
    idea: BusinessIdea,
    currentTurn: number,
    currentCash: number,
    language: Language
): Promise<SimulationEvent | null> => {
    try {
        const langInstruction = language === 'am' 
            ? "IMPORTANT: Provide all text content in Amharic language. Keep the JSON structure and keys in English."
            : "Provide content in English.";

        const prompt = `
            Act as a Dungeon Master for a business simulation game called "NeonTycoon".
            
            Current Game State:
            - Business: ${idea.businessTitle} (Machine: ${idea.machineName})
            - Month: ${currentTurn} of 12
            - Cash Available: $${currentCash}

            Generate a challenging business scenario/event relevant to this specific business type.
            The scenario could be an opportunity (viral marketing, bulk order) or a crisis (machine breakdown, supplier delay).

            Provide 3 Choices for the player:
            - Choice A: "Cheap/Risky" (Low cost, high risk of morale loss or future failure).
            - Choice B: "Standard/Balanced" (Moderate cost, safe outcome).
            - Choice C: "Expensive/Premium" (High cost, guaranteed success + morale boost).

            For each choice, estimate the immediate Cash Impact (negative for cost, positive for revenue) and Morale Impact (-10 to +10).
            
            ${langInstruction}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: simulationEventSchema,
                temperature: 0.8
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as SimulationEvent;
        }
        return null;

    } catch (e) {
        console.error("Sim Event Generation Error", e);
        return null;
    }
}

export const streamChat = async function* (
    history: { role: 'user' | 'model', parts: { text: string }[] }[],
    newMessage: string,
    context: string,
    language: Language
) {
    const langInstruction = language === 'am' ? "IMPORTANT: Reply in Amharic language." : "Reply in English.";

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash-lite', // Low latency model
        history: history,
        config: {
            systemInstruction: `
            You are "Prof. Fad", an eccentric, high-energy, futuristic AI business consultant for the NeonVentures app.
            Your goal is to help users find machine-based business ideas and navigate the app.
            
            Personality:
            - Use cyberpunk slang occasionally (e.g., "operative", "uplink", "synapse").
            - Be concise and punchy. Maximum 2-3 sentences per response unless asked for detail.
            - Extremely encouraging but realistic about business risks.
            
            Context:
            ${context}
            
            ${langInstruction}

            If the user asks about the app, guide them to:
            1. Select an industry to scan.
            2. Or build a profile for personalized matches.
            3. View details and business canvases for specific ideas.
            `
        }
    });

    const result = await chat.sendMessageStream({ message: newMessage });
    for await (const chunk of result) {
        yield chunk.text;
    }
};