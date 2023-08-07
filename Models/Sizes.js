import { Sequelize } from "sequelize";
import sequelize from "../Configs/ModelConfig.js";

const Sizes = sequelize.define("sizes", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
});

export default Sizes;
