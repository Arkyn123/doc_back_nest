import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
  PrimaryKey,
} from 'sequelize-typescript';
import { T_XXHR_SCHEDULE_BRIGADES } from './T_XXHR_SCHEDULE_BRIGADES.model';
import { T_XXHR_OSK_ORG_HIERARHY_V } from './T_XXHR_OSK_ORG_HIERARHY_V.model';
import { T_XXHR_OSK_POSITIONS } from './T_XXHR_OSK_POSITIONS.model';

@Table({
  tableName: 'T_XXHR_OSK_ASSIGNMENTS_V',
  schema: 'dbo',
  timestamps: false,
  indexes: [
    {
      name: 'IND_ASSIGNMENT_START_END',
      fields: ['ASSIGNMENT_ID', 'START_DATE', 'END_DATE'],
    },
  ],
})
export class T_XXHR_OSK_ASSIGNMENTS_V extends Model<T_XXHR_OSK_ASSIGNMENTS_V> {
  @Column({ type: DataType.NUMBER, allowNull: false })
  PERSON_ID: number;

  @PrimaryKey
  @Column({ type: DataType.NUMBER, allowNull: false })
  ASSIGNMENT_ID: number;

  @Column({ type: DataType.STRING(30), allowNull: false })
  EMPLOYEE_NUMBER: string;

  @Column({ type: DataType.STRING(30), allowNull: false })
  LAST_NAME!: string;

  @Column({ type: DataType.STRING(150), allowNull: false })
  FIRST_NAME: string;

  @Column({ type: DataType.STRING(60), allowNull: false })
  MIDDLE_NAMES: string;

  @Column({ type: DataType.DATE, allowNull: false })
  DATE_OF_BIRTH: Date;

  @Column({ type: DataType.STRING(30), allowNull: false })
  ASSIGNMENT_NUMBER: string;

  @Column({ type: DataType.NUMBER, allowNull: false })
  DOLJN_ID: number;

  @Column({ type: DataType.STRING(30), allowNull: false })
  EMPLOYEE_NUMBER_MANAGER: string;

  @Column({ type: DataType.STRING(4000), allowNull: false })
  DOLJN: string;

  @Column({ type: DataType.DATE, allowNull: false })
  START_DATE!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  END_DATE!: Date;

  // @Column({ type: DataType.NUMBER, allowNull: false })
  // POSITION_ID: number;

  @Column({ type: DataType.STRING(240), allowNull: false })
  POSITION_NAME: string;

  @Column({ type: DataType.STRING(150), allowNull: false })
  COD: string;

  // @Column({ type: DataType.NUMBER, allowNull: false })
  // ORG_ID: number;

  @Column({ type: DataType.STRING(240), allowNull: false })
  ORG_NAME!: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  PARENT_ORG_ID: number;

  @Column({ type: DataType.STRING(240), allowNull: false })
  PARENT_ORG_NAME: string;

  @Column({ type: DataType.STRING(240), allowNull: false })
  GRADE: string;

  @Column({ type: DataType.DATE, allowNull: false })
  TERMINATION_DATE: Date;

  @Column({ type: DataType.STRING(12), allowNull: false })
  RSS: string;

  @Column({ type: DataType.STRING(1), allowNull: false })
  GENDER: string;

  @Column({ type: DataType.STRING(80), allowNull: false })
  PAYROLL_NAME: string;

  @ForeignKey(() => T_XXHR_OSK_POSITIONS)
  @Column({ type: DataType.NUMBER, allowNull: false })
  POSITION_ID: number;

  @BelongsTo(() => T_XXHR_OSK_POSITIONS, 'ORG_ID')
  assignments: T_XXHR_OSK_POSITIONS;
  
  @ForeignKey(() => T_XXHR_OSK_POSITIONS)
  @ForeignKey(() => T_XXHR_OSK_ORG_HIERARHY_V)
  @Column({ type: DataType.NUMBER, allowNull: true })
  ORG_ID: number;

  @BelongsTo(() => T_XXHR_OSK_ORG_HIERARHY_V, 'ORG_ID')
  orgHierarchy: T_XXHR_OSK_ORG_HIERARHY_V;
}
