import { Sequelize } from "sequelize";
import sequelize from "../Configs/ModelConfig.js";

const PCateg = sequelize.define("pcateg", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
});

export default PCateg;
