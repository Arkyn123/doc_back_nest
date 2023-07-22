import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

@Table({
  tableName: 'T_XXHR_SCHEDULE_BRIGADES',
  schema: 'dbo',
  timestamps: false,
})
export class T_XXHR_SCHEDULE_BRIGADES extends Model<T_XXHR_SCHEDULE_BRIGADES> {
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true })
  WORK_SCHEDULE_ID: number;

  @Column({ type: DataType.STRING(5), allowNull: false })
  BRIGADE: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  NOTE: string;
}
