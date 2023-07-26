import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { T_XXHR_OSK_ASSIGNMENTS_V } from './T_XXHR_OSK_ASSIGNMENTS_V.model';
import { T_XXHR_OSK_ORG_HIERARHY_V } from './T_XXHR_OSK_ORG_HIERARHY_V.model';

@Table({
  tableName: 'T_XXHR_OSK_POSITIONS',
  timestamps: false,
})
export class T_XXHR_OSK_POSITIONS extends Model<T_XXHR_OSK_POSITIONS> {
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    primaryKey: true,
  })
  POSITION_ID: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  POSITION_NAME: string;

  @ForeignKey(() => T_XXHR_OSK_ASSIGNMENTS_V)
  @ForeignKey(() => T_XXHR_OSK_ORG_HIERARHY_V)
  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  ORG_ID: number;

  @BelongsTo(() => T_XXHR_OSK_ORG_HIERARHY_V, 'ORG_ID')
  T_XXHR_OSK_ORG_HIERARHY_V: T_XXHR_OSK_ORG_HIERARHY_V;

  @BelongsTo(() => T_XXHR_OSK_ASSIGNMENTS_V, 'ORG_ID')
  T_XXHR_OSK_ASSIGNMENTS_V: T_XXHR_OSK_ASSIGNMENTS_V;
}
