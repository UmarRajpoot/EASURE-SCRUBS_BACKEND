import { Sequelize } from "sequelize";
import sequelize from "../Configs/ModelConfig.js";

const Products = sequelize.define("products", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  productname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  productimage: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: true,
  },
  productvideo: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "",
  },
  parentcategory: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  personname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  varientname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  typename: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  typestylename: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  sizes: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: false,
  },
  colors: {
    type: Sequelize.JSONB,
    allowNull: false,
  },
  trend: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  suggestions: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: true,
  },
  displayImage: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

export default Products;
