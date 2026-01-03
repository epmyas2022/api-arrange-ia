import { Groq } from 'groq-sdk';
import { ModelCallback } from 'src/types/api-chat.types';
import * as dotenv from 'dotenv';

dotenv.config();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const groqModelCallback: ModelCallback = async function* (messages) {
  const chatCompletion = await groq.chat.completions.create({
    messages,
    model: 'openai/gpt-oss-20b',
    temperature: 1,
    max_completion_tokens: 8192,
    top_p: 1,
    stream: true,
    reasoning_effort: 'medium',
    stop: null,
  });

  for await (const chunk of chatCompletion) {
    yield {
      role: 'assistant',
      content: chunk.choices[0]?.delta?.content || '',
    };
  }
};
