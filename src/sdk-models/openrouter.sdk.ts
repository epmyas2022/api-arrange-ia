import { OpenRouter } from '@openrouter/sdk';
import * as dotenv from 'dotenv';
import { ModelCallback } from 'src/types/api-chat.types';

dotenv.config();
const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const openRouterModelCallback: ModelCallback = async function* (
  messages,
) {
  const completion = await openRouter.chat.send({
    model: 'mistralai/mistral-7b-instruct',
    messages,
    stream: false,
  });

  const content = completion.choices[0].message.content;
  const contentString =
    typeof content === 'string' ? content : JSON.stringify(content);

  yield {
    role: 'assistant',
    content: contentString,
  };
};
