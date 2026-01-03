import { Injectable, Logger } from '@nestjs/common';
import { ApiChat, ChatMessage, ChatRequest } from 'src/types/api-chat.types';

@Injectable()
export class ApiChatV1Service extends ChatRequest {
  currentModelIndex: number = 0;
  private readonly apis: ApiChat[] = [];

  addModel(model: ApiChat[]): this {
    this.apis.push(...model);
    return this;
  }

  getCurrentModel(): ApiChat {
    return this.apis[this.currentModelIndex];
  }

  generateCursor(messages: ChatMessage[]): string {
    return Buffer.from(JSON.stringify(messages)).toString('base64');
  }

  parseCursor(cursor: string): ChatMessage[] {
    return JSON.parse(Buffer.from(cursor, 'base64').toString());
  }

  async response(
    message: string,
    options?: {
      cursor?: string;
      defaultPrompt?: ChatMessage;
    },
  ): Promise<AsyncGenerator<ChatMessage>> {
    Logger.log(`Using model: ${this.apis[this.currentModelIndex].name}`);

    const { defaultPrompt, cursor } = options || {};

    /*     const isSpecifyDefaultPrompt = !cursor && defaultPrompt;
     */
    const messages: ChatMessage[] = [
      /* ...(isSpecifyDefaultPrompt ? [defaultPrompt] : []), */
      ...(defaultPrompt ? [defaultPrompt] : []),
      ...(cursor ? this.parseCursor(cursor) : []),
      { role: 'user', content: message },
    ];
    const callback = this.apis[this.currentModelIndex].callback;
    this.currentModelIndex = (this.currentModelIndex + 1) % this.apis.length;

    const chunks = callback(messages);

    return chunks;
  }
}
