import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export interface DepartmentAttributes {
  id: number;
  name: string;
  description: string;
}

export interface DepartmentCreationAttributes
  extends Optional<DepartmentAttributes, 'id'> {}

export class Department
  extends Model<DepartmentAttributes, DepartmentCreationAttributes>
  implements DepartmentAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
}

export function DepartmentModel(sequelize: Sequelize): typeof Department {
  Department.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'departments'
    }
  );

  return Department;
}