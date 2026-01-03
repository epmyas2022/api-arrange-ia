import * as fs from 'node:fs';
import path from 'node:path';
import { ChatMessage } from 'src/types/api-chat.types';

export function loadPrompt(name: string): ChatMessage {
  try {
    const filePath = path.join(__dirname, `${name}.md`);
    const prompt = fs.readFileSync(filePath, 'utf8');
    return {
      role: 'system',
      content: prompt,
    };
  } catch (error) {
    throw new Error(`Failed to load prompt: ${error}`);
  }
}
