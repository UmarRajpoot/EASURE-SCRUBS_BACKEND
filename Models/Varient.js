import { Sequelize } from "sequelize";
import sequelize from "../Configs/ModelConfig.js";

const Varient = sequelize.define("varient", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
});

export default Varient;
