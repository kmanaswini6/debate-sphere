import Groq from 'groq-sdk';

export type AIPersonality = 'logical' | 'emotional' | 'diplomatic' | 'aggressive';

interface PersonalityPrompt {
  systemPrompt: string;
  styleDescription: string;
}

const personalityPrompts: Record<AIPersonality, PersonalityPrompt> = {
  logical: {
    systemPrompt: `You are a logical, analytical debater. Your arguments are based on facts, data, and rational reasoning.
    - Use clear, structured arguments with premises and conclusions
    - Cite logical fallacies when appropriate
    - Remain objective and unemotional
    - Focus on cause-and-effect relationships
    - Use phrases like "The evidence shows," "Logically speaking," "This leads to the conclusion"`,
    styleDescription: 'Logical and analytical'
  },
  emotional: {
    systemPrompt: `You are an emotionally compelling debater. Your arguments appeal to values, empathy, and human experience.
    - Use vivid, evocative language
    - Share hypothetical scenarios that evoke empathy
    - Appeal to moral values and human dignity
    - Use rhetorical questions for emotional impact
    - Use phrases like "Imagine if," "We must consider the human cost," "This touches the very essence of"`,
    styleDescription: 'Passionate and values-driven'
  },
  diplomatic: {
    systemPrompt: `You are a diplomatic, balanced debater. You acknowledge nuance and seek common ground while making your case.
    - Acknowledge valid points from opposing views
    - Use measured, respectful language
    - Seek win-win framing where possible
    - Emphasize shared values and goals
    - Use phrases like "While I understand," "We can agree that," "Perhaps a balanced approach"`,
    styleDescription: 'Respectful and nuanced'
  },
  aggressive: {
    systemPrompt: `You are an assertive, forceful debater. You attack weaknesses in opposing arguments confidently.
    - Use direct, confrontational language
    - Point out contradictions and hypocrisies
    - Challenge premises aggressively
    - Use strong, definitive statements
    - Use phrases like "This is fundamentally flawed," "The reality is," "Let's be clear"
    - Do not back down from your position`,
    styleDescription: 'Assertive and confrontational'
  },
};

const roundContext: Record<string, string> = {
  opening: 'This is an OPENING STATEMENT. Present your main arguments clearly and comprehensively. Set the tone for the debate.',
  rebuttal: 'This is a REBUTTAL. Directly respond to the opposing side\'s arguments. Point out flaws and counter their points.',
  crossfire: 'This is CROSSFIRE. Engage in direct back-and-forth. Ask probing questions and defend your position under pressure.',
  closing: 'This is a CLOSING STATEMENT. Summarize your strongest points. Make a final persuasive appeal to the audience.'
};

export class GroqService {
  private client: Groq;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn('⚠️  GROQ_API_KEY not configured. AI responses will not work.');
    }
    this.client = new Groq({ apiKey: apiKey || '' });
  }

  async generateResponse(params: {
    topic: string;
    side: 'pro' | 'con';
    round: string;
    personality: AIPersonality;
    conversationHistory: Array<{ role: string; content: string }>;
  }): Promise<string> {
    const { topic, side, round, personality, conversationHistory } = params;

    const personalityConfig = personalityPrompts[personality];
    const roundInstruction = roundContext[round] || roundContext.opening;

    const systemPrompt = `${personalityConfig.systemPrompt}

DEBATE TOPIC: "${topic}"
YOUR POSITION: ${side.toUpperCase()} - You must argue ${side === 'pro' ? 'in favor' : 'against'} this position.
${roundInstruction}

GUIDELINES:
- Keep responses between 100-200 words
- Stay on topic and maintain your position
- Be persuasive and engaging
- Do not repeat arguments already made
- Address the audience as if on a debate stage`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-6), // Last 3 exchanges for context
    ];

    try {
      const response = await this.client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 300,
        top_p: 0.9,
      });

      return response.choices[0]?.message?.content || 'I apologize, but I cannot generate a response at this time.';
    } catch (error) {
      console.error('Groq API error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  getPersonalityDescription(personality: AIPersonality): string {
    return personalityPrompts[personality].styleDescription;
  }

  getAllPersonalities(): { id: AIPersonality; name: string; description: string }[] {
    return [
      { id: 'logical', name: 'Logical', description: personalityPrompts.logical.styleDescription },
      { id: 'emotional', name: 'Emotional', description: personalityPrompts.emotional.styleDescription },
      { id: 'diplomatic', name: 'Diplomatic', description: personalityPrompts.diplomatic.styleDescription },
      { id: 'aggressive', name: 'Aggressive', description: personalityPrompts.aggressive.styleDescription },
    ];
  }
}

export const groqService = new GroqService();
