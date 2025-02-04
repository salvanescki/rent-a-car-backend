import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { DocumentsService } from '../services/documents.service';
import { Document } from '../entities/document.entity';
import { UpdateDocumentDto } from '../dto/update-document.dto';

@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post()
  createDocument(@Body() document: CreateDocumentDto) {
    return this.documentsService.createDocument(document);
  }

  @Get()
  getDocuments(): Promise<Document[]> {
    return this.documentsService.getDocuments();
  }

  @Get(':authorId/:id')
  getDocumentById(
    @Param('authorId') authorId: string,
    @Param('id') id: string,
  ) {
    return this.documentsService.getDocumentById(authorId, id);
  }

  @Delete(':authorId/:id')
  deleteDocument(@Param('authorId') authorId: string, @Param('id') id: string) {
    return this.documentsService.deleteDocument(id, authorId);
  }

  @Patch(':authorId/:id')
  updateDocument(
    @Param('authorId') authorId: string,
    @Param('id') id: string,
    @Body() document: UpdateDocumentDto,
  ) {
    return this.documentsService.updateDocument(id, authorId, document);
  }
}
