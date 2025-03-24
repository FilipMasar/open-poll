import { prisma } from './prisma';

// Generate a unique code for polls (format: 6 characters, letters and numbers)
export async function generateUniqueCode(length = 6): Promise<string> {
  // Characters to use for generating codes (excluding similar looking characters)
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  
  // Number of attempts to try generating a unique code
  const maxAttempts = 10;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let code = '';
    
    // Generate a random code
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    
    // Check if the code already exists
    const existingPoll = await prisma.poll.findUnique({
      where: { code },
    });
    
    // If the code doesn't exist, return it
    if (!existingPoll) {
      return code;
    }
  }
  
  // If we couldn't generate a unique code after maxAttempts, throw an error
  throw new Error('Failed to generate a unique poll code');
}

// Function to extract most frequent words from responses
export function generateWordFrequencies(texts: string[]): Record<string, number> {
  // Combine all text
  const combinedText = texts.join(' ').toLowerCase();
  
  // Split into words and remove common stop words
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her',
    'its', 'our', 'their', 'this', 'that', 'these', 'those', 'of', 'in', 'with',
    'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'from', 'up', 'down', 'out', 'off', 'over', 'under',
    'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
    'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
    'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  ]);
  
  const words = combinedText
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/) // Split by whitespace
    .filter(word => word.length > 2 && !stopWords.has(word)); // Filter out stop words and short words
  
  // Count word frequencies
  const wordFrequencies: Record<string, number> = {};
  
  for (const word of words) {
    if (wordFrequencies[word]) {
      wordFrequencies[word]++;
    } else {
      wordFrequencies[word] = 1;
    }
  }
  
  // Filter to only include words that appear at least twice
  const filteredFrequencies: Record<string, number> = {};
  for (const [word, count] of Object.entries(wordFrequencies)) {
    if (count >= 2) {
      filteredFrequencies[word] = count;
    }
  }
  
  // Return top 50 words
  return Object.fromEntries(
    Object.entries(filteredFrequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)
  );
}

// A simple function to generate an AI summary from responses
// In a real app, this would call an AI API like OpenAI
export function generateAISummary(texts: string[]): string {
  if (texts.length === 0) {
    return 'No responses to summarize.';
  }
  
  // Simple summary logic for demo purposes
  // Count how many responses
  const responseCount = texts.length;
  
  // Get average response length
  const avgLength = texts.reduce((sum, text) => sum + text.length, 0) / responseCount;
  
  // Get longest and shortest responses
  let shortest = texts[0];
  let longest = texts[0];
  for (const text of texts) {
    if (text.length < shortest.length) shortest = text;
    if (text.length > longest.length) longest = text;
  }
  
  // Get sample of responses
  const sampleSize = Math.min(3, texts.length);
  const samples = [];
  for (let i = 0; i < sampleSize; i++) {
    const randomIndex = Math.floor(Math.random() * texts.length);
    samples.push(`"${texts[randomIndex]}"`);
  }
  
  return `This poll received ${responseCount} responses. The average response length was ${Math.round(avgLength)} characters. 
  
Here are some sample responses:
${samples.join('\n')}

In a production environment, this would be replaced with an actual AI-generated summary using a service like OpenAI's GPT.`;
} 