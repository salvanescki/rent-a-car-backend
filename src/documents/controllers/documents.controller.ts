import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { DocumentsService } from '../services/documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post()
  createDocument(@Body() document: CreateDocumentDto) {
    return this.documentsService.createDocument(document);
  }

  @Get()
  getDocuments() {
    return this.documentsService.getDocuments();
  }
}
