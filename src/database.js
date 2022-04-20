import {Sequelize} from "sequelize";

export const database = new Sequelize('postgres://postgres:password@localhost:5432/Relatable', {
    dialect: 'postgres',
    logging: false
});

export const init = async () => {
    await database.authenticate();
    await database.sync({alter: true,});
    console.log('Connection has been established successfully.');
}