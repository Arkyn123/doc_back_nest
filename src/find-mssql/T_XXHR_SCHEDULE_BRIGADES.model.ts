import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { T_XXHR_OSK_ORG_HIERARHY_V } from './T_XXHR_OSK_ORG_HIERARHY_V.model';
import { T_XXHR_OSK_ASSIGNMENTS_V } from './T_XXHR_OSK_ASSIGNMENTS_V.model';

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
