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

export interface OtherMessageResponse {
  messageId: string;
  senderEmail: string;
  senderName: string;
  emailSubject: string;
  emailSummary: string;
  extractedJson: string;
  emailRaw: string;
  emailDate: string | Date;
  inquiryType: number;
  isInquiry: number;
}

export type SalesInquiryResponse = {
  messageId: string;
  senderEmail: string;
  senderName: string;
  companyName: string;
  mobileNumber: string;
  emailSubject: string;
  emailSummary: string;
  extractedJson: string;
  emailRaw: string;
  emailDate: string | Date;
  inquiryType: string;
  isInquiry: number;
}

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = 'sk-f04e4da6abde41f8967811a97fa693b8';  // Replace with your actual DeepSeek API key

// Function to analyze email content with DeepSeek API
export async function analyzeEmailContent(
  emailObject: any,
): Promise<OtherMessageResponse | SalesInquiryResponse> {  // Change the return type to ClassifiedEmailResponse
  const prompt = `
Analyze this email and determine if it's a sales inquiry or other type of message. 

Return JSON with these fields:

If non-sales inquirn mail
{
  messageId: varchar("message_id", { length: 255 }),
  senderEmail: varchar("sender_email", { length: 255 }),
  senderName: varchar("sender_name", { length: 255 }),
  emailSubject: varchar("email_subject", { length: 255 }),
  emailSummary: text("email_summary"),
  extractedJson: text("extracted_json"),
  emailRaw: text("email_raw"),
  emailDate: datetime("email_date"), // As ISO string
  inquiryType: varchar("inquiry_type", { length: 100 }),
  isInquiry: boolean("is_inquiry"),
}

If sales inquiry mail
{
  messageId: varchar('message_id', { length: 255 }),
  senderEmail: varchar('sender_email', { length: 255 }),
  senderName: varchar('sender_name', { length: 255 }),
  companyName: varchar('company_name', { length: 255 }),
  mobileNumber: varchar('mobile_number', { length: 50 }),
  emailSubject: varchar('email_subject', { length: 255 }),
  emailSummary: text('email_summary'),
  extractedJson: text('extracted_json'),
  emailRaw: text('email_raw'),
  emailDate: datetime('email_date'), // As ISO string
  inquiryType: varchar('inquiry_type', { length: 100 }),
  isInquiry: tinyint('is_inquiry'),
}

    Email Object from IMAP: ${JSON.stringify(emailObject, null, 2)}
    
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
      const analysisResult = JSON.parse(cleanedResponse);

      return analysisResult;  // Return the ClassifiedEmailResponse type
    }

    throw new Error('Invalid response structure from DeepSeek API');
  } catch (error) {
    console.error('Error analyzing email content with DeepSeek API:', error);
    throw new Error('Failed to analyze email content');
  }
}
