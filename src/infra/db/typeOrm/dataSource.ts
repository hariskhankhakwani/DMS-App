import { DataSource } from "typeorm";
import { UserModel } from "./model/userModel";


export const AppDataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: String(process.env.DB_PASSWORD),
      database: process.env.DB_NAME,
      synchronize:true,
      entities:[UserModel]
    });