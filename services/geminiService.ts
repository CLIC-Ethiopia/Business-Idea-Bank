import { GoogleGenAI, Type, Schema } from "@google/genai";
import { BusinessIdea, BusinessCanvas, UserProfile } from "../types";

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

export const generateIdeas = async (industry: string): Promise<BusinessIdea[]> => {
  try {
    const prompt = `
      I am an entrepreneur looking for small-scale business ideas in the ${industry} industry.
      Please search your internal knowledge base for specific machines, systems, or technologies typically found on platforms like Alibaba or Amazon.
      List 6 distinct business ideas where purchasing one specific machine allows me to start a service or manufacturing business.
      Focus on machines that are accessible to small businesses (under $50,000 investment).
      For each, provide the machine name, a business title, price range, and likely source.
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
      return JSON.parse(response.text) as BusinessIdea[];
    }
    return [];
  } catch (error) {
    console.error("Error generating ideas:", error);
    return [];
  }
};

export const generatePersonalizedIdeas = async (profile: UserProfile): Promise<BusinessIdea[]> => {
  try {
    const prompt = `
      Act as a business consultant. Analyze the following user profile and recommend 6 personalized small business ideas based on machines/technologies available on Alibaba/Amazon.
      
      User Profile:
      - Budget: ${profile.budget}
      - Skills: ${profile.skills}
      - Interests: ${profile.interests}
      - Risk Tolerance: ${profile.riskTolerance}
      - Time Commitment: ${profile.timeCommitment}

      Constraints:
      1. Ideas must involve buying a specific machine or system to start the business.
      2. The machine cost must fit within or near the user's budget.
      3. The business should align with their skills and interests.
      
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
      return JSON.parse(response.text) as BusinessIdea[];
    }
    return [];
  } catch (error) {
    console.error("Error generating personalized ideas:", error);
    return [];
  }
};

export const generateCanvas = async (idea: BusinessIdea): Promise<BusinessCanvas | null> => {
  try {
    const prompt = `
      Create a detailed Business Model Canvas for the following business idea:
      Machine: ${idea.machineName}
      Business: ${idea.businessTitle}
      Description: ${idea.description}
      
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