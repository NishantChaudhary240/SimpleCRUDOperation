import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();    //loads setting

export const sequelize = new Sequelize(
  process.env.DB_NAME!,     //selects DB
  process.env.DB_USER!,     //selects user
  process.env.DB_PASSWORD || undefined, //use pw if configured
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    dialect: "postgres",    //tells Sequelize which database system to use.
    logging: false,
  }
);