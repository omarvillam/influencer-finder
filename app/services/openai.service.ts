import OpenAI from "openai";
import {SearchConfigState} from "~/stores/searchConfigStore";

export async function findInfluencer(influencerName: string | null, mode: SearchConfigState['mode'], apiKey: string) {
  const openai = new OpenAI({
    apiKey: apiKey,
  });

  const prompt = `
    You are a database of influencers. Your task is to ${
      mode === "specific"
        ? `find the slug (unique identifier) of the influencer named "${influencerName}".`
        : `find a random influencer in the health-related domain.`
    }
  
    Respond ONLY with the slug as plain text, without any additional formatting. 
    If ${
      mode === "specific"
        ? `the influencer is not found,`
        : `no influencer can be discovered,`
    } respond with "Influencer not found".
  `;


  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const slug = response.choices[0]?.message?.content?.trim();

    if (!slug || slug.toLowerCase() === "influencer not found") {
      throw new Error("Influencer not found");
    }

    return slug;
  } catch (error) {
    console.error("Error finding influencer slug:", error);
    return null;
  }
}

export async function analyzeInfluencer(params: Partial<SearchConfigState>, apiKey: string) {
  const openai = new OpenAI({
    apiKey: apiKey,
  });
  const {
    influencerName,
    timeRange,
    claimsToAnalyze,
    selectedJournals,
    verifyWithJournals,
    productsPerInfluencer,
    includeRevenueAnalysis
  } = params;

  const prompt = `
  You are an AI system specialized in analyzing influencer content. Your task is to analyze the influencer "${influencerName}" based on recent data, including tweets, podcast transcripts, and online profiles. Your analysis must follow these requirements:

  1. Influencer Information:
     - **Name**: "${influencerName}"
     - **Avatar**: Real link to the influencer's profile picture. If not found, return an empty string.
     - **Categories**: List 5-10 topics or fields this influencer specializes in.
     - **Description**: A concise biography (max 1000 characters).
     - **Products**: Analyze up to ${productsPerInfluencer} associated products.
     - **Yearly Revenue**: Estimated yearly revenue (e.g., "$5M"). ${includeRevenueAnalysis ? "Include revenue analysis based on the influencer's online presence and associated content." : "Exclude revenue analysis."}
     - **Followers**: Total number of followers across platforms.
     - **Overall Trust Score**: Calculate an average trust score.

  2. Claims Analysis:
     - Analyze recent tweets and podcast transcripts within the time range "${timeRange === "all" ? "all time" : `the last ${timeRange}`}."
     - Provide up to ${claimsToAnalyze} unique claims. For each claim, include:
       - **Claim text**: The unique health-related claim.
       - **Category**: E.g., Nutrition, Medicine, Mental Health.
       - **Trust Score**: A percentage (e.g., 85%).
       - **Original Source**: Include a description and link.
       - **Verification Sources**: If applicable, provide journal references.
       - **Verification Status**: One of "Verified", "Questionable", or "Debunked".
       ${verifyWithJournals
    ? `- Cross-reference these claims against the following scientific journals: ${selectedJournals!.map(
      (journal) => journal.name
    ).join(", ")}. Ensure journal references are included in the response.`
    : "- Do not perform cross-referencing against scientific journals."}

  3. Output:
     - Return the result **only as valid JSON** in the following format:
     {
       "name": "...",
       "avatar": "...",
       "categories": ["...", "..."],
       "description": "...",
       "products": 0,
       "revenue": "$...",
       "followers": "...M",
       "trust": "...%",
       "claims": [
         {
           "claim": "...",
           "category": "...",
           "trust": "...%",
           "originalSource": { "description": "...", "link": "..." },
           "verificationSources": [{ "name": "...", "description": "...", "link": "..." }],
           "status": "..."
         }
       ]
     }
     - If you cannot fulfill the request, return: {"error": "Unable to process request"}.
  `;


  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("No response content received from OpenAI.");
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      console.error("Invalid JSON response:", content);
      throw new Error("OpenAI response is not valid JSON.");
    }
  } catch (error) {
    console.error("Error analyzing influencer:", error);
    throw error;
  }
}

export async function getLeaderboard(apiKey: string): Promise<{
  leaderboard: {
    rank: number;
    avatar: string;
    name: string;
    category: string;
    trustScore: number;
    trend: "up" | "down";
    followers: string;
    verifiedClaims: number;
  }[];
  totalVerifiedClaims: number;
  averageTrustScore: number;
}> {
  const openai = new OpenAI({
    apiKey: apiKey,
  });

  const prompt = `
    You are an AI assistant tasked with identifying and analyzing 50 REAL well-known health influencers based on your extensive knowledge. Generate a leaderboard of real health influencers, ensuring the data appears credible and relevant. Focus on influencers known for their expertise in health-related fields, such as Nutrition, Medicine, Mental Health, Fitness, Neuroscience, and Longevity.
  
    Provide the following structure:
    
    {
      "leaderboard": [
        {
          "rank": 1,
          "avatar": "URL of the avatar image (realistic representation of the influencer)",
          "slug" "Unique identifier of the influencer",
          "name": "Full name of the influencer",
          "category": "Main category (e.g., Nutrition, Medicine, etc.)",
          "trustScore": Trust score as a percentage (e.g., 95),
          "trend": "up or down (trend of trust score)",
          "followers": "Number of followers in shorthand format (e.g., 1.2M, 980K, etc.)",
          "verifiedClaims": Number of verified claims
        }
      ],
      "totalVerifiedClaims": "Total number of verified claims across all influencers",
      "averageTrustScore": "Average trust score across all influencers as a percentage"
    }
    
    Guidelines:
    1. Use influencers who are publicly recognized and known in the health industry.
    2. Generate realistic and relevant follower counts (e.g., 100K-5M+), trust scores (80%-100%), and verified claims.
    3. Ensure the names, categories, and metrics are credible.
    4. If you are unable to generate accurate results, provide a fallback JSON structure with an error message.
    
    Only return valid JSON with no additional text or comments.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("No content received from OpenAI.");
    }

    try {
      const data = JSON.parse(content);
      return data;
    } catch (error) {
      console.error("Invalid JSON response from OpenAI:", content);
      throw new Error("OpenAI response is not valid JSON.");
    }
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    throw error;
  }
}

