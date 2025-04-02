import { prisma } from './prisma';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This needs to be set in your environment variables
});

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
  console.log(combinedText);
  
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
  // const filteredFrequencies: Record<string, number> = {};
  // for (const [word, count] of Object.entries(wordFrequencies)) {
  //   if (count >= 2) {
  //     filteredFrequencies[word] = count;
  //   }
  // }
  
  // Return top 50 words
  return Object.fromEntries(
    Object.entries(wordFrequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)
  );
}

// Function to generate an AI summary from responses using OpenAI
export async function generateAISummary(texts: string[], question: string): Promise<string> {
  if (texts.length === 0) {
    return 'No responses to summarize. Crickets chirping... 🦗';
  }

  try {
    const prompt = `Hey there, AI buddy! 🤖 We've got some interesting responses to a poll asking: "${question}"

Here's what our lovely humans said:
${texts.map((text, index) => `${index + 1}. ${text}`).join('\n')}

Could you whip up a fun, light-hearted summary of what people think? Feel free to:
- Point out any hilarious patterns
- Maybe throw in a joke if you spot something funny
- Give us the TL;DR with a splash of personality
- Add some emojis for extra flavor ✨

Keep it casual and entertaining, but still informative! No need to be all corporate and serious about it. 😊`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
    });

    return completion.choices[0].message.content || 'Oops! The AI seems to be taking a coffee break. ☕';
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return 'Houston, we have a problem! Our AI friend is having a moment. Try again later! 🚀';
  }
} 