"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDataSource = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
const path_1 = require("path");
// Load environment variables from the backend/.env file
dotenv.config({ path: (0, path_1.join)(__dirname, '../../.env') });
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    driver: require('mysql2'),
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'real_estate_platform',
    entities: [(0, path_1.join)(__dirname, '../../src/entities/**/*.entity{.ts,.js}')],
    synchronize: false,
    logging: true,
});
const initializeDataSource = async () => {
    try {
        await exports.AppDataSource.initialize();
        console.log('Data Source has been initialized!');
    }
    catch (err) {
        console.error('Error during Data Source initialization:', err);
        throw err;
    }
};
exports.initializeDataSource = initializeDataSource;
