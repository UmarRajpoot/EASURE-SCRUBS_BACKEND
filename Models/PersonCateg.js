import { Sequelize } from "sequelize";
import sequelize from "../Configs/ModelConfig.js";

const PersonCateg = sequelize.define("personcateg", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
});

export default PersonCateg;
