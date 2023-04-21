import { Test, TestingModule } from '@nestjs/testing';
import { ChatsServiceController } from './chats-service.controller';
import { ChatsServiceService } from './chats-service.service';

describe('ChatsServiceController', () => {
  let chatsServiceController: ChatsServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ChatsServiceController],
      providers: [ChatsServiceService],
    }).compile();

    chatsServiceController = app.get<ChatsServiceController>(ChatsServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(chatsServiceController.getHello()).toBe('Hello World!');
    });
  });
});
