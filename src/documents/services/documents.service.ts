import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from '../entities/document.entity';
import { Repository } from 'typeorm';
import { CreateDocumentDto } from '../dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private usersService: UsersService,
  ) {}

  async createDocument(document: CreateDocumentDto) {
    const userFound = await this.usersService.getUserById(document.authorId);
    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    const newDocument = this.documentRepository.create(document);
    return this.documentRepository.save(newDocument);
  }

  getDocuments() {
    return this.documentRepository.find({
      relations: ['author'],
    });
  }
}
