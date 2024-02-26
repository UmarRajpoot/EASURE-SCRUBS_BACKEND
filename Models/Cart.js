import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../Configs/ModelConfig.js";

const Cart = sequelize.define("cart", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4, // 741852963
    primaryKey: true,
  },
  products: {
    type: DataTypes.JSONB,
    allowNull: false, // [{123, 2},{456, 1},{789,1}] 22 + 22 + 22 = $44
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
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
});

export default Cart;
