import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Document } from '../document/document.model';

@Table({ tableName: 'DocumentOrderLog', freezeTableName: true })
export class DocumentOrderLog extends Model<DocumentOrderLog> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @ForeignKey(() => Document)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  documentId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  order: number;

  @Column({ type: DataType.STRING(512), allowNull: false })
  orderDescription: string;

  @Column({ type: DataType.STRING(512), allowNull: false })
  statusDescription: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  personalNumber: number;

  @Column({ type: DataType.STRING(256), allowNull: false })
  fullname: string;

  @Column({ type: DataType.STRING(256), allowNull: true })
  message: string;

  @Column({ type: DataType.STRING(128), allowNull: true })
  registrationNumber: string;

  @BelongsTo(() => Document, 'documentId')
  document: Document;
}
