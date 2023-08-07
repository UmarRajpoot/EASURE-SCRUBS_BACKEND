import { Sequelize } from "sequelize";
import sequelize from "../Configs/ModelConfig.js";

const Colors = sequelize.define("colors", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  colorType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  colorcode: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  photo: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "",
  },
});

export default Colors;
