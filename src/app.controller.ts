import { Body, Controller, Post } from '@nestjs/common';
import { ApiChatV1Service } from './services/api-chat-v1.service';
/* import { mockTestModelCallback } from './sdk-models/mock-test.sdk';
 */ import { groqModelCallback } from './sdk-models/groq.sdk';
import { cerebrasModelCallback } from './sdk-models/cerebras.sdk';
import { ChatMessage } from './types/api-chat.types';
import { openRouterModelCallback } from './sdk-models/openrouter.sdk';
import { loadPrompt } from './prompts/prompt';
import { MessageDto } from './dtos/message.dto';

@Controller()
export class AppController {
  constructor(private readonly api: ApiChatV1Service) {
    api.addModel([
      /* {
        name: 'mocktest',
        version: '1.0',
        callback: mockTestModelCallback,
      }, */

      {
        name: 'cerebras',
        version: '1.0',
        callback: cerebrasModelCallback,
      },
      {
        name: 'groq',
        version: '1.0',
        callback: groqModelCallback,
      },
      {
        name: 'openrouter',
        version: '1.0',
        callback: openRouterModelCallback,
      },
    ]);
  }

  @Post()
  async store(
    @Body() { message, cursor }: MessageDto,
  ): Promise<{ ok: string; cursor: string; response: string }> {
    const context = loadPrompt('about-me');
    const memory: ChatMessage[] = [context];
    let response = '';
    const stream = await this.api.response(message, {
      cursor,
      defaultPrompt: context,
    });

    for await (const chunk of stream) {
      process.stdout.write(chunk.content);
      response += chunk.content;
    }
    memory.push(
      { role: 'user', content: message || '' },
      { role: 'assistant', content: response },
    );
    return {
      ok: 'done',
      response,
      cursor: this.api.generateCursor(memory),
    };
  }
}
