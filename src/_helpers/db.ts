import mysql from 'mysql2/promise';
import mysql2 from 'mysql2';
import { Sequelize } from 'sequelize';
import config from '../../config.json';

export interface Database {
    User: any;
    Account: any;
    RefreshToken: any;
    Department: any;
}

export const db: Database = {} as Database;

export async function initialize(): Promise<void> {
    const host = process.env.DB_HOST || config.database.host;
    const port = Number(process.env.DB_PORT || config.database.port);
    const user = process.env.DB_USER || config.database.user;
    const password = process.env.DB_PASSWORD || config.database.password;
    const database = process.env.DB_NAME || config.database.database;
    try {
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
        await connection.end();
    } catch (err: any) {
        console.warn('Could not ensure database existence (this is normal on shared hosting):', err.message);
    }

    const sequelize = new Sequelize(database, user, password, {
        dialect: 'mysql',
        dialectModule: mysql2,
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