import sequelize from "./ModelConfig.js";
import Auth from "../Models/Auth.js";
import Products from "../Models/Products.js";
import Returns from "../Models/Returns.js";
import Cart from "../Models/Cart.js";
import Contact from "../Models/Contact.js";
import Orders from "../Models/Orders.js";

sequelize
  .authenticate()
  .then(() => {
    console.log("Success!");
  })
  .catch((err) => {
    console.log(err);
  });

// Add all data and Sync

// sequelize.sync({ alter: true }).then(() => {
//   console.log("Sync Done.");
// });

export default sequelize;
