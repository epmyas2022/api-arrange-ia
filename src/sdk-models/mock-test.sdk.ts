import { ChatMessage, ModelCallback } from 'src/types/api-chat.types';

export const mockTestModelCallback: ModelCallback = async function* (messages) {
  for (const message of messages) {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Simula un retardo
    yield {
      role: 'assistant',
      content: `Echo: ${message.content}`,
    } as ChatMessage;
  }
};
