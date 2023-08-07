import { Sequelize } from "sequelize";
import sequelize from "../Configs/ModelConfig.js";

const TypeStyle = sequelize.define("typestyle", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
});

export default TypeStyle;
