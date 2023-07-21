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
  tableName: 'T_XXHR_SCHEDULE_BRIGADES_V',
  schema: 'dbo',
  timestamps: false,
})
export class T_XXHR_SCHEDULE_BRIGADES_V extends Model<T_XXHR_SCHEDULE_BRIGADES_V> {
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true })
  WORK_SCHEDULE_ID: number;

  @Column({ type: DataType.STRING(5), allowNull: false })
  BRIGADE: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  NOTE: string;

  @ForeignKey(() => T_XXHR_OSK_ORG_HIERARHY_V)
  @Column
  ORGANIZATION_ID: number;

  @BelongsTo(() => T_XXHR_OSK_ORG_HIERARHY_V)
  organizations: T_XXHR_OSK_ORG_HIERARHY_V;

  @ForeignKey(() => T_XXHR_OSK_ASSIGNMENTS_V)
  @Column
  ASSIGNMENT_ID: number;

  @BelongsTo(() => T_XXHR_OSK_ASSIGNMENTS_V)
  assignments: T_XXHR_OSK_ASSIGNMENTS_V;
}
