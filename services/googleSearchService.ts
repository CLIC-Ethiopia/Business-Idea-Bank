
// Keys should be loaded from environment variables to ensure security and validity.
// Do NOT hardcode keys here.
const API_KEY = process.env.GOOGLE_SEARCH_API_KEY || "";
const CX = process.env.GOOGLE_SEARCH_CX || "";

export const fetchMachineImage = async (query: string): Promise<string | undefined> => {
  // Graceful fallback if keys are not configured
  if (!API_KEY || !CX) {
    // Return undefined silently to allow UI to use default placeholders
    return undefined;
  }

  try {
    // We append "machine" or "equipment" to context to ensure we get a product shot
    const searchQuery = `${query} machine equipment`;
    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(searchQuery)}&searchType=image&num=1&safe=active&imgSize=large`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        // Log a warning instead of an error to keep the console clean
        console.warn(`Google Search API warning for "${query}": Status ${response.status}`);
        return undefined;
    }

    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return data.items[0].link;
    }
  } catch (error) {
    // Silently handle network errors
    console.warn(`Failed to fetch image for query "${query}"`);
  }
  
  return undefined;
};