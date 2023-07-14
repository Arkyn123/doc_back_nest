import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { DicOfficeCorrespondence } from '../dicOfficeCorrespondence/dicOfficeCorrespondence.model';

@Table({ tableName: 'DIC_OFFICE', schema: 'dbo', timestamps: false })
export class DicOffice extends Model<DicOffice> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  })
  ID: number;

  @Column({ type: DataType.STRING(255), allowNull: true })
  Name: string;

  @Column({ type: DataType.STRING(30), allowNull: true })
  Index: string;

  @Column({ type: DataType.STRING(30), allowNull: true })
  ShortName: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  Position_ID: number;

  @Column({ type: DataType.DATE, allowNull: true })
  CreatedDate: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  UpdatedDate: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  DeletedDate: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  FlagDeleted: boolean;

  @HasMany(() => DicOfficeCorrespondence, 'OFFICE_ID')
  CORRESPONDENCE: DicOfficeCorrespondence[];
}
