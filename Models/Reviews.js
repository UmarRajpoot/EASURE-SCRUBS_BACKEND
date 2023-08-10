import { Sequelize } from "sequelize";
import sequelize from "../Configs/ModelConfig.js";

const Review = sequelize.define("review", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  starcount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  desc: {
    type: Sequelize.STRING(800),
    allowNull: false,
  },
  productID: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default Review;
