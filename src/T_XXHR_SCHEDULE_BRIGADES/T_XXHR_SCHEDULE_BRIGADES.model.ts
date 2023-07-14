import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'T_XXHR_SCHEDULE_BRIGADES',
  schema: 'dbo',
  timestamps: false,
})
export class T_XXHR_SCHEDULE_BRIGADES extends Model<T_XXHR_SCHEDULE_BRIGADES> {
  @Column({ type: DataType.INTEGER, allowNull: true })
  WORK_SCHEDULE_ID: number;

  @Column({ type: DataType.STRING(5), allowNull: true })
  BRIGADE: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  BRIGADE_NAME: string;
}
