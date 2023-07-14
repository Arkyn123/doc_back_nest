import { PartialType } from '@nestjs/mapped-types';
import { DocumentDTO } from './DocumentDTO';

export class UpdateDocumentDTO extends PartialType(DocumentDTO) {}
