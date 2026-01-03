import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiChatV1Service } from './services/api-chat-v1.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [ApiChatV1Service],
})
export class AppModule {}
