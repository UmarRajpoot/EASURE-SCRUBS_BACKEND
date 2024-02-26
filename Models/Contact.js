import { Sequelize } from "sequelize";
import sequelize from "../Configs/ModelConfig.js";

const Contact = sequelize.define("contact", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  gender: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default Contact;
