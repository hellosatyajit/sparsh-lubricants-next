// Define the interface for DeepSeek API Response
export interface DeepSeekAPIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    logprobs: null | object;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    prompt_tokens_details: {
      cached_tokens: number;
    };
    prompt_cache_hit_tokens: number;
    prompt_cache_miss_tokens: number;
  };
  system_fingerprint: string;
}

export interface ClassifiedEmailResponse {
  is_inquiry: boolean;
  inquiry_type: 'sales' | 'support' | 'general' | 'other';
  inquiry_reason: string;
  sender_name: string;
  company_name: string | null;
  mobile_number: string | null;
  purpose: string;
  key_questions: string[];
  summary: string;
}

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = 'sk-f04e4da6abde41f8967811a97fa693b8';  // Replace with your actual DeepSeek API key

// Function to analyze email content with DeepSeek API
export async function analyzeEmailContent(
  emailContent: string,
  emailSubject: string
): Promise<ClassifiedEmailResponse> {  // Change the return type to ClassifiedEmailResponse
  const prompt = `
    Analyze this email and determine if it's a sales inquiry or other type of message. 
    Return JSON with these fields:
    {
        "is_inquiry": boolean,
        "inquiry_type": "sales|support|general|other",
        "inquiry_reason": "reason for classification",
        "sender_name": "if inquiry, extracted name",
        "company_name": "if inquiry, extracted company",
        "mobile_number": "if inquiry, extracted phone",
        "purpose": "if inquiry, main purpose",
        "key_questions": ["if inquiry, list of questions"],
        "summary": "if inquiry, 3-4 sentence summary"
    }

    Email Subject: ${emailSubject}
    Email Content: ${emailContent}
    
    Return ONLY the JSON object.
  `;

  const requestData = {
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    max_tokens: 1000,
  };

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error Response from DeepSeek API:', errorDetails);
      throw new Error('Failed to fetch from DeepSeek API');
    }

    const responseData: DeepSeekAPIResponse = await response.json();

    // Check if the response contains the expected structure
    const messageContent = responseData?.choices?.[0]?.message?.content;

    if (messageContent) {
      // Remove any extraneous backticks or markdown-style formatting from the response
      const cleanedResponse = messageContent.replace(/```json|```/g, '').trim();

      // Try to parse the cleaned response as JSON
      const analysisResult: ClassifiedEmailResponse = JSON.parse(cleanedResponse);

      return analysisResult;  // Return the ClassifiedEmailResponse type
    }

    throw new Error('Invalid response structure from DeepSeek API');
  } catch (error) {
    console.error('Error analyzing email content with DeepSeek API:', error);
    throw new Error('Failed to analyze email content');
  }
}
