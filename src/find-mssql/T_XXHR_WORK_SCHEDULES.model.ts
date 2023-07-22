import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'T_XXHR_WORK_SCHEDULES',
  schema: 'dbo',
  timestamps: false,
})
export class T_XXHR_WORK_SCHEDULES extends Model<T_XXHR_WORK_SCHEDULES> {
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true })
  WORK_SCHEDULE_ID: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  BUSINESS_GROUP_ID: number;

  @Column({ type: DataType.STRING(8), allowNull: false })
  CODE: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  NAME: string;

  @Column({ type: DataType.STRING(1) })
  VALID_FLAG: string;

  @Column({ type: DataType.STRING(1), allowNull: false })
  RECURRING: string;

  @Column({ type: DataType.STRING(1), allowNull: false })
  HOLIDAY_REST: string;

  @Column({ type: DataType.STRING(1), allowNull: false })
  KEEP_WEEKEND: string;

  @Column({ type: DataType.SMALLINT })
  SHIFTS_NUMBER: number;

  @Column({ type: DataType.BIGINT })
  SEQ_NUMBER: number;

  @Column({ type: DataType.SMALLINT })
  LUNCH_LENGTH: number;

  @Column({ type: DataType.STRING(255) })
  NOTE: string;

  @Column({ type: DataType.DATE })
  LAST_UPDATE_DATE: Date;

  @Column({ type: DataType.BIGINT })
  LAST_UPDATED_BY: number;

  @Column({ type: DataType.BIGINT })
  LAST_UPDATE_LOGIN: number;

  @Column({ type: DataType.BIGINT })
  CREATED_BY: number;

  @Column({ type: DataType.DATE })
  CREATION_DATE: Date;
}
