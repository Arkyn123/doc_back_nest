import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';

@Table({
  tableName: 'DIC_OFFICE_CORRESPONDENCE',
  schema: 'dbo',
  timestamps: false,
})
export class DicOfficeCorrespondence extends Model<DicOfficeCorrespondence> {
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true,
  })
  ID: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  ORG_ID: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  PARENT_ORG_ID: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  OFFICE_ID: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  CreatedDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  UpdatedDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  DeletedDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  FlagDeleted: boolean;
}
