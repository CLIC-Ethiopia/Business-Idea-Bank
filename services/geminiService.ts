import { GoogleGenAI, Type, Schema } from "@google/genai";
import { BusinessIdea, BusinessCanvas, BusinessDetails, UserProfile, Language } from "../types";
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
      description: { type: Type.STRING, description: "How the machine is used to make money" },
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