import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Document } from '../document/document.model';

@Table({
  tableName: 'DocumentStatus',
  freezeTableName: true,
  timestamps: false,
})
export class DocumentStatus extends Model<DocumentStatus> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @Column({ type: DataType.STRING(512), allowNull: false })
  description: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  ownerId: number;

  @Column({ type: DataType.STRING(128), allowNull: false })
  ownerFullname: string;

  @HasMany(() => Document, 'statusId')
  documents: Document[];
}
