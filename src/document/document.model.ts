import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { DocumentStatus } from '../documentStatus/documentStatus.model';
import { DocumentOrderLog } from '../documentOrderLog/DocumentOrderLog.model';

@Table({ tableName: 'Document', freezeTableName: true })
export class Document extends Model<Document> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @Column({ type: DataType.JSON, defaultValue: {} })
  body: object;

  @Column({ type: DataType.STRING(256) })
  message: string;

  @Column({ type: DataType.INTEGER })
  messageUserId: number;

  @Column({ type: DataType.STRING(256) })
  messageUserFullname: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  order: number;

  @Column({ type: DataType.STRING(256) })
  permitionCurrent: string;

  @Column({ type: DataType.STRING(256) })
  permitionCurrentDesc: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  authorPersonalNumber: number;

  @Column({ type: DataType.STRING(256), allowNull: false })
  authorFullname: string;

  @Column({ type: DataType.STRING(128) })
  registrationNumber: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  documentTemplateID: number;

  @Column({ type: DataType.STRING(256), allowNull: false })
  documentType: string;

  @Column({ type: DataType.STRING(256), allowNull: false })
  documentTypeDescription: string;

  @Column({ type: DataType.JSONB, defaultValue: () => [] })
  users: any[];

  @Column({ type: DataType.STRING(512), defaultValue: () => '' })
  usernames: string;

  @Column({ type: DataType.STRING(256) })
  officeName: string;

  @Column({ type: DataType.DATE })
  dateApplication: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  deletedDate: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  flagDeleted: boolean;

  @Column({ type: DataType.STRING(256), allowNull: true })
  deletedAuthorFullname: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  deletedAuthorPersonalNumber: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  officeId: number;

  @BelongsTo(() => DocumentStatus, {
    foreignKey: 'statusId',
    as: 'documentStatus',
  })
  status: DocumentStatus;

  @HasMany(() => DocumentOrderLog, 'documentId')
  documentOrderLog: DocumentOrderLog;
}
