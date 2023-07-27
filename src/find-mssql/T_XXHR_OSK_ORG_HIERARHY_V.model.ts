import {
  Column,
  Model,
  Table,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { T_XXHR_OSK_POSITIONS } from './T_XXHR_OSK_POSITIONS.model';

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

  @Column({ type: DataType.NUMBER, allowNull: false })
  ORGANIZATION_ID_PARENT: number;

  @ForeignKey(() => T_XXHR_OSK_POSITIONS)
  @Column({ type: DataType.NUMBER, allowNull: false })
  ORGANIZATION_ID: number;

  @BelongsTo(() => T_XXHR_OSK_POSITIONS, 'ORG_ID')
  T_XXHR_OSK_POSITIONS: T_XXHR_OSK_POSITIONS;
}
