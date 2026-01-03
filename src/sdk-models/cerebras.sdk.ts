import Cerebras from '@cerebras/cerebras_cloud_sdk';
import * as dotenv from 'dotenv';
import { ModelCallback } from 'src/types/api-chat.types';

dotenv.config();
const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY || '',
});

export const cerebrasModelCallback: ModelCallback = async function* (messages) {
  const completion = await cerebras.chat.completions.create({
    messages: messages as any,
    model: 'llama-3.3-70b',
    max_completion_tokens: 1024,
    temperature: 0.2,
    top_p: 1,
    stream: false,
  });

  yield {
    role: 'assistant',
    content: completion.choices[0].message.content,
  };
};
