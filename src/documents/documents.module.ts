import { Module } from '@nestjs/common';
import { DocumentsService } from './services/documents.service';
import { DocumentsController } from './controllers/documents.controller';

@Module({
  providers: [DocumentsService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
