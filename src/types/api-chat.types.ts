export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type ModelCallback = (
  messages: ChatMessage[],
) => AsyncGenerator<ChatMessage>;

export interface ApiChat {
  name: string;
  version: string;
  callback: ModelCallback;
}
export abstract class ChatRequest {
  abstract currentModelIndex: number;
  abstract addModel(model: ApiChat[]): this;
  abstract getCurrentModel(): ApiChat;
  abstract response(message: string): Promise<AsyncGenerator<ChatMessage>>;
}
