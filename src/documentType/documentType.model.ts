import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'DocumentType', freezeTableName: true })
export class DocumentType extends Model<DocumentType> {
  @Column({ type: DataType.STRING(256), primaryKey: true, allowNull: false })
  id: string;

  @Column({ type: DataType.STRING(256), allowNull: false })
  description: string;
}
