import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { DocumentType } from '../documentType/documentType.model';

@Table({ tableName: 'DocumentRoute', freezeTableName: true })
export class DocumentRoute extends Model<DocumentRoute> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  orderId: number;

  @Column({ type: DataType.STRING(256), allowNull: false })
  permition: string;

  @Column({ type: DataType.STRING(256), allowNull: false })
  description: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  ownerId: number;

  @Column({ type: DataType.STRING(128), allowNull: false })
  ownerFullname: string;

  @Column({ type: DataType.STRING(256), allowNull: false })
  documentType: string;

  // @ForeignKey(() => DocumentType)
  // @Column
  // documentTypeId: number;
}
