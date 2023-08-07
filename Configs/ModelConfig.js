import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 9,
      min: 0,
      idle: 10000,
    },
    // Testing.
    timezone: "+05:00",
  }
);

export default sequelize;
