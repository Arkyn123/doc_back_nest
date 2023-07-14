import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'File', freezeTableName: true })
export class File extends Model<File> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @Column({ type: DataType.STRING(512), allowNull: false })
  id_file: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  documentId: number;

  @Column({ type: DataType.STRING(512), allowNull: false })
  fullpath: string;

  @Column({ type: DataType.STRING(512), allowNull: false })
  file: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  employeeNumberAddFile: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  statusDelete: boolean;
}
