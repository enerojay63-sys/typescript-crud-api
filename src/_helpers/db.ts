import { Sequelize, Model, ModelStatic } from 'sequelize';
import { UserModel } from 'users/user.model';
const config = require('../../config.json');

export interface Database {
  sequelize: Sequelize;
  User: ModelStatic<Model>;
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

  await sequelize.sync({ alter: true });
  console.log('✅ Database connected and synced');
}

export { db, initialize };