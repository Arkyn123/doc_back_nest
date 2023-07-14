import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'DIC_OFFICE_CORRESPONDENCE',
  schema: 'dbo',
  timestamps: false,
})
export class DicOfficeCorrespondence extends Model<DicOfficeCorrespondence> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
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
    references: {
      model: 'DIC_OFFICE',
      key: 'ID',
    },
  })
  OFFICE_ID: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
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
