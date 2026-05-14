import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';

export interface Database {
    User: any;
    Account: any;
    RefreshToken: any;
    Department: any;
}

export const db: Database = {} as Database;

export async function initialize(): Promise<void> {
    const host = process.env.DB_HOST!;
    const port = Number(process.env.DB_PORT);
    const user = process.env.DB_USER!;
    const password = process.env.DB_PASSWORD!;
    const database = process.env.DB_NAME!;

    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    await connection.end();

    const sequelize = new Sequelize(database, user, password, {
        dialect: 'mysql',
        host,
        port
    });

    const { UserModel } = await import('../users/user.model');
    const { default: accountModel } = await import('../accounts/account.model');
    const { default: refreshTokenModel } = await import('../accounts/refresh-token.model');

    db.User = UserModel(sequelize);
    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);

    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    await sequelize.sync({ alter: true });

    console.log('______DATABASE INITIALIZED AND MODELS SYNCED______');
}