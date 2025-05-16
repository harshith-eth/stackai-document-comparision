/**
 * Azure OpenAI API utility functions
 * This file handles all interactions with the Azure OpenAI API
 */

// The environment variables are loaded in vite.config.ts
interface ComparisonRequest {
  criteria: string;
  document1: string;
  document2: string;
}

interface ComparisonResponse {
  text: Array<{
    section: string;
    doc1: string;
    doc2: string;
    changeType?: 'addition' | 'deletion' | 'modification' | 'unchanged';
    importance?: 'high' | 'medium' | 'low';
  }>;
}

/**
 * Compare two documents using Azure OpenAI
 */
export async function compareDocumentsWithAI(
  criteria: string, 
  document1Content: string, 
  document2Content: string
): Promise<ComparisonResponse> {
  try {
    // Check if environment variables are available
    const apiKey = import.meta.env.VITE_AZURE_OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY;
    const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || process.env.AZURE_OPENAI_ENDPOINT;
    const deploymentName = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME || process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
    const apiVersion = import.meta.env.VITE_AZURE_OPENAI_API_VERSION || process.env.AZURE_OPENAI_API_VERSION || '2025-01-01-preview';
    
    if (!apiKey || !endpoint || !deploymentName) {
      console.error('Azure OpenAI environment variables are not properly configured');
      throw new Error('Azure OpenAI configuration missing');
    }
    
    console.log(`Using Azure OpenAI endpoint: ${endpoint}`);
    console.log(`Using Azure OpenAI deployment: ${deploymentName}`);
    
    // Construct the API URL
    const apiUrl = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;
    
    // Prepare the prompt with explicit instructions for document comparison
    const prompt = `
    I need you to compare two documents and identify the key differences between them.
    Use the following criteria for comparison: ${criteria}
    
    Document 1:
    ${truncateIfNeeded(document1Content, 10000)}
    
    Document 2:
    ${truncateIfNeeded(document2Content, 10000)}
    
    For each relevant section, provide:
    1. The section name or topic
    2. The content from Document 1
    3. The content from Document 2
    4. The type of change (addition, deletion, modification, or unchanged)
    5. The importance of the change (high, medium, low)
    
    Format your response as a JSON object matching this structure:
    {
      "text": [
        {
          "section": "Section Name",
          "doc1": "Content from document 1",
          "doc2": "Content from document 2",
          "changeType": "addition|deletion|modification|unchanged",
          "importance": "high|medium|low"
        }
      ]
    }
    
    Focus on meaningful differences, not formatting or minor wording changes unless they alter the meaning.
    Ensure your response is a valid JSON object.
    `;
    
    console.log('Sending request to Azure OpenAI...');
    
    // Make the API request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are an AI assistant specialized in document comparison.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 4000,
        top_p: 0.95,
        response_format: { type: 'json_object' }
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure OpenAI API error:', errorText);
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Parse the response content as JSON
    try {
      // Extract the assistant's message content
      const assistantMessage = data.choices[0].message.content;
      
      // Parse the JSON from the message content
      const comparisonResult = JSON.parse(assistantMessage);
      
      return comparisonResult as ComparisonResponse;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('Error in compareDocumentsWithAI:', error);
    throw error;
  }
}

/**
 * Helper function to truncate text if it exceeds a maximum length
 * This is to ensure we don't exceed token limits in the API
 */
function truncateIfNeeded(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  // Add a message indicating truncation
  return text.substring(0, maxLength) + `\n\n[Content truncated due to length. Original length: ${text.length} characters]`;
} 