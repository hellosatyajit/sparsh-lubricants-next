// lib/classifyemail.ts

// Function to classify email based on its subject or content
export async function classifyEmail(emailSubject: string, emailContent: string): Promise<string> {
  const inquiryKeywords = ['quote', 'quotation', 'price', 'cost', 'information', 'order']
  const nonInquiryKeywords = ['newsletter', 'spam', 'update', 'promotion']

  // Simple classification logic based on keywords
  for (const keyword of inquiryKeywords) {
    if (emailContent.toLowerCase().includes(keyword)) {
      return 'inquiry'
    }
  }

  for (const keyword of nonInquiryKeywords) {
    if (emailContent.toLowerCase().includes(keyword)) {
      return 'non-inquiry'
    }
  }

  // Default to non-inquiry if no keywords are found
  return 'non-inquiry'
}
