import "dotenv/config";
import { sequelize } from "./database";
import Employee from "./models/Employee";

async function main() {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");

    await Employee.sync();
    console.log("Employee table created!");
  } catch (error) {
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

main();