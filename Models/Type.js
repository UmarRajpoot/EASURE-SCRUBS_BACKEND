import { Sequelize } from "sequelize";
import sequelize from "../Configs/ModelConfig.js";

const Type = sequelize.define("type", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
});

export default Type;
