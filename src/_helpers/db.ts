import { Sequelize, Model, ModelStatic } from 'sequelize';
import { UserModel } from 'users/user.model';
import { DepartmentModel } from 'users/department.model';
const config = require('../../config.json');

export interface Database {
  sequelize: Sequelize;
  User: ModelStatic<Model>;
  Department: ModelStatic<Model>;
}

const db: Database = {} as Database;

async function initialize(): Promise<void> {
  const { host, port, user, password, database } = config.database;

  const sequelize = new Sequelize(database, user, password, {
    host,
    port,
    dialect: 'mysql'
  });

  await sequelize.authenticate();

  db.sequelize = sequelize;
  db.User = UserModel(sequelize);
  db.Department = DepartmentModel(sequelize);

  await sequelize.sync({ alter: true });

  await seedDepartments();

  console.log('✅ Database connected and synced');
}

async function seedDepartments(): Promise<void> {
  const count = await db.Department.count();
  if (count === 0) {
    await db.Department.bulkCreate([
      { name: 'Engineering', description: 'Software development and IT' },
      { name: 'HR', description: 'Human Resources' }
    ] as any);
    console.log('✅ Departments seeded');
  }
}

export { db, initialize };