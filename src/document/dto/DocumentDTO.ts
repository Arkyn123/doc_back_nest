import { DocumentStatusDTO } from '../../documentStatus/dto/DocumentStatusDTO';
import { DocumentOrderLogDTO } from '../../documentOrderLog/dto/DocumentOrderLogDTO';

export class DocumentDTO {
  id: number;
  body: object;
  message: string;
  messageUserId: number;
  messageUserFullname: string;
  order: number;
  permitionCurrent: string;
  permitionCurrentDesc: string;
  authorPersonalNumber: number;
  authorFullname: string;
  registrationNumber: string;
  documentTemplateID: number;
  documentType: string;
  documentTypeDescription: string;
  users: any[];
  usernames: string;
  officeName: string;
  dateApplication: Date;
  deletedDate: Date;
  flagDeleted: boolean;
  deletedAuthorFullname: string;
  deletedAuthorPersonalNumber: number;
  officeId: number;
  documentStatus: DocumentStatusDTO;
  documentOrderLog: DocumentOrderLogDTO;
}
