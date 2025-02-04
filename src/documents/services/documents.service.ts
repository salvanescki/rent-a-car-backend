import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from '../entities/document.entity';
import { Repository } from 'typeorm';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { User } from '../../users/entities/user.entity';
import { UpdateDocumentDto } from '../dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private usersService: UsersService,
  ) {}

  async _findUserById(id: string): Promise<User> {
    const userFound = await this.usersService.getUserById(id);
    if (!userFound) {
      throw new NotFoundException('User not found');
    }
    return userFound;
  }

  async _findDocumentById(id: string, authorId: string): Promise<Document> {
    const documentFound = await this.documentRepository.findOne({
      where: { id, authorId },
    });
    if (!documentFound) {
      throw new NotFoundException('Document not found');
    }
    return documentFound;
  }

  async createDocument(document: CreateDocumentDto) {
    await this._findUserById(document.authorId);

    const newDocument = this.documentRepository.create(document);
    return this.documentRepository.save(newDocument);
  }

  getDocuments(): Promise<Document[]> {
    return this.documentRepository.find({
      relations: ['author'],
    });
  }

  async getDocumentById(authorId: string, id: string): Promise<Document> {
    await this._findUserById(authorId);
    return this._findDocumentById(id, authorId);
  }

  async deleteDocument(id: string, authorId: string) {
    await this._findUserById(authorId);
    await this._findDocumentById(id, authorId);
    return this.documentRepository.delete({ id, authorId });
  }

  async updateDocument(
    id: string,
    authorId: string,
    document: UpdateDocumentDto,
  ) {
    await this._findUserById(authorId);
    await this._findDocumentById(id, authorId);
    return this.documentRepository.update({ id, authorId }, document);
  }
}
