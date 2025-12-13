
const API_KEY = "AIzaSyC8mI8YK66ttK3piJvoVerg_PrDc2wWKjM";
const CX = "371351460d53a4daa";

export const fetchMachineImage = async (query: string): Promise<string | undefined> => {
  // Graceful fallback if keys are not configured
  if (!API_KEY || !CX) {
    console.warn("Google Search API keys are missing. Falling back to placeholders.");
    return undefined;
  }

  try {
    // We append "machine" or "equipment" to context to ensure we get a product shot
    const searchQuery = `${query} machine equipment`;
    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(searchQuery)}&searchType=image&num=1&safe=active&imgSize=large`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Google Search API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return data.items[0].link;
    }
  } catch (error) {
    console.error("Error fetching image for query:", query, error);
  }
  
  return undefined;
};
