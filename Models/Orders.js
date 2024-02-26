import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../Configs/ModelConfig.js";

const Orders = sequelize.define("orders", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  order_id: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: false,
  },
  country: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  firstname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  state: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  zipcode: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  orderItems: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  subTotal: {
    type: DataTypes.FLOAT,
    allowNull: false, // 0
    defaultValue: 0,
  },
  shippingCharges: {
    type: DataTypes.FLOAT,
    allowNull: false, // 0
    defaultValue: 0,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false, // 0
    defaultValue: 0,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "unpaid",
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emailSended: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

export default Orders;
