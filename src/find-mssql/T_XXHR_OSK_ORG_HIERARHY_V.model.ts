import {
  Column,
  Model,
  Table,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { T_XXHR_SCHEDULE_BRIGADES } from './T_XXHR_SCHEDULE_BRIGADES.model';
import { T_XXHR_OSK_POSITIONS } from './T_XXHR_OSK_POSITIONS.model';
import { T_XXHR_OSK_ASSIGNMENTS_V } from './T_XXHR_OSK_ASSIGNMENTS_V.model';

@Table({
  tableName: 'T_XXHR_OSK_ORG_HIERARHY_V',
  schema: 'dbo',
  timestamps: false,
})
export class T_XXHR_OSK_ORG_HIERARHY_V extends Model<T_XXHR_OSK_ORG_HIERARHY_V> {
  @Column({ type: DataType.FLOAT, allowNull: true, primaryKey: true })
  ORG_STRUCTURE_VERSION_ID: number;

  @Column({ type: DataType.DATE, allowNull: false })
  DATE_FROM: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  DATE_TO: Date;

  @Column({
    type: DataType.STRING(240),
    allowNull: false,
  })
  ORG_NAME: string;

  @Column({ type: DataType.NUMBER, allowNull: true })
  SEQUENTIAL_NUMBER: number;

  @Column({
    type: DataType.STRING(80),
    allowNull: true,
  })
  TYPE_NAME: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
  })
  TYPE: string;

  @Column({ type: DataType.DATE, allowNull: false })
  update_date: Date;

  @ForeignKey(() => T_XXHR_OSK_POSITIONS)
  @Column({ type: DataType.NUMBER, allowNull: true })
  ORGANIZATION_ID: number;

  @BelongsTo(() => T_XXHR_OSK_POSITIONS, 'ORGANIZATION_ID')
  orgHierarchy: T_XXHR_OSK_ORG_HIERARHY_V;
}