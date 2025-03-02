import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface AddressComparisonResult {
  match: boolean;
  confidence: number;
  explanation: string;
}

export async function compareAddresses(
  address1: string,
  address2: string
): Promise<AddressComparisonResult> {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Construct the prompt for address comparison
    const prompt = `
    I need to compare two addresses to determine if they refer to the same physical location.
    
    Address 1: "${address1}"
    Address 2: "${address2}"
    
    Please analyze these addresses and provide a JSON response with the following structure:
    {
      "match": boolean, // true if the addresses likely refer to the same location, false otherwise
      "confidence": number, // a value between 0 and 1 indicating confidence level
      "explanation": string // brief explanation of the reasoning
    }
    
    Consider variations in formatting, abbreviations, missing apartment/unit numbers, 
    typos, and other common differences in address notation.
    
    Only return the JSON object, nothing else.
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract the JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON response from Gemini");
    }
    
    const parsedResult = JSON.parse(jsonMatch[0]) as AddressComparisonResult;
    
    return parsedResult;
  } catch (error) {
    console.error("Error comparing addresses:", error);
    return {
      match: false,
      confidence: 0,
      explanation: "Error processing address comparison"
    };
  }
}