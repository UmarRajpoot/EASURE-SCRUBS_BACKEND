import { Sequelize } from "sequelize";
import sequelize from "../Configs/ModelConfig.js";

const Returns = sequelize.define("returns", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  orderId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  zipcode: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  returnreason: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  returnstatus: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "Pending",
  },
});

export default Returns;
