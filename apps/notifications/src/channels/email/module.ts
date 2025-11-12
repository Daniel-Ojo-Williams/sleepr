import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { EMAIL_QUEUE } from '../../constants';
import { EmailQueueProcessor } from './processor';
import { EmailService } from './service';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    BullModule.registerQueue({
      name: EMAIL_QUEUE,
    }),
    BullBoardModule.forFeature({
      name: EMAIL_QUEUE,
      adapter: BullMQAdapter,
    }),
  ],
  providers: [EmailQueueProcessor, EmailService],
  exports: [EmailQueueProcessor, EmailService],
})
export class EmailModule {}
