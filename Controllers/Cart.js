import Joi from "joi";
import createHttpError from "http-errors";
import Products from "../Models/Products.js";
import Cart from "../Models/Cart.js";

export default {
  addCartItems: async (req, res, next) => {
    try {
      const Cart_joi_schema = Joi.object({
        products: Joi.object().required(), // productId, qty, name,price
        userId: Joi.string().allow(null).trim().default(null),
      });
      const validatesResult = await Cart_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { products, userId } = validatesResult.value;

      console.log("Add New Cart");
      const addToCart = await Cart.create({
        userId: userId,
        products: [products],
        subTotal: parseFloat(products.originalPrice).toFixed(2),
        total: parseFloat(products.originalPrice).toFixed(2),
      });

      return res.status(200).send({
        success: true,
        message: `Items are added into Cart.`,
        response: addToCart && addToCart.dataValues,
      });
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
  updateCart: async (req, res, next) => {
    try {
      const Cart_joi_schema = Joi.object({
        products: Joi.object().required(), // productId, qty, name,price
        cartId: Joi.string().allow(null).trim().default(null),
        userId: Joi.string().allow(null).trim().default(null),
      });
      const validatesResult = await Cart_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { products, cartId, userId } = validatesResult.value;

      console.log("Updated Action.");

      let ProductItems = []; // Saved into DB
      let SubTotal = 0;
      let indProductTotal = 0;
      let Total = 0;

      const getCart = await Cart.findOne({
        where: {
          id: cartId,
        },
      })
        .then((resp) => {
          ProductItems = resp.dataValues.products;
          //   SubTotal = resp.dataValues.subTotal;
          Total = resp.dataValues.total;
        })
        .catch((error) => {
          return next(
            createHttpError(406, { success: false, message: error.message })
          );
        });

      const IsalreadyAdded = ProductItems.findIndex(
        (prodItem) => prodItem.productID === products.productID
      );

      if (IsalreadyAdded > -1) {
        console.log("Product Exists", IsalreadyAdded);
        const productItems = ProductItems[IsalreadyAdded];
        productItems.count = products.count;
        productItems.productLength = products.productLength;
        productItems.productcolor = products.productcolor;
        productItems.productsize = products.productsize;
        indProductTotal +=
          parseFloat(productItems.originalPrice) *
          parseFloat(productItems.count);
        productItems.productPrice = indProductTotal.toString();
      } else {
        ProductItems.push(products);
      }

      const CalculateSubTotal = ProductItems.map((prod) => {
        SubTotal += parseFloat(prod.productPrice);
      });

      const updateCart = await Cart.update(
        {
          products: ProductItems,
          subTotal: SubTotal,
          total: Total,
        },
        {
          where: {
            id: cartId,
          },
          returning: true,
        }
      );
      const getAllCartItems = await Cart.findOne({
        where: {
          id: updateCart[1][0].dataValues.id,
        },
      })
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: `Updated Products`,
            response: resp && resp.dataValues,
          });
        })
        .catch((error) => {
          return next(
            createHttpError(406, { success: false, message: error.message })
          );
        });

      // let carttemArray = [];

      // const getUnique = cartItems.map(
      //   (fil_pro) => fil_pro.productID === products.productID
      // );
      // console.log(getUnique);
      // if (getUnique[0] === false) {
      //   console.log("Its not matched Product in cart");
      //   carttemArray = [...getItems, products];
      // } else {
      //   console.log("It's Matched");
      //   let remainingItems = getItems.filter((prod) => {
      //     if (prod.productID === products.productID) {
      //       prod.count = products.count;
      //       prod.productLength = products.productLength;
      //       prod.productcolor = products.productcolor;
      //       prod.productsize = products.productsize;
      //     }
      //     return prod;
      //   });
      //   //   console.log(remainingItems);
      //   carttemArray = [...getUnique, ...remainingItems];
      // }

      // console.log("Updates", cartItems);
      // let Total = 0;
      // let subTotal = 0;
      // const CalculateItemTotal = cartItems.map((items) => {
      //   subTotal += parseInt(items.count) * parseFloat(items.productPrice);
      // });

      // // console.log(updateCart[1][0].dataValues.id);
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
  deleteCart: async (req, res, next) => {
    try {
      const Cart_joi_schema = Joi.object({
        id: Joi.string().required(), // productId, qty, name,price
      });
      const validatesResult = await Cart_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { id } = validatesResult.value;
      const deleteCart = await Cart.destroy({
        where: {
          id: id,
        },
      });
      res.send({ deleteCart });
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
  getAllCartItems: async (req, res, next) => {
    try {
      const Cart_joi_schema = Joi.object({
        cartId: Joi.string().allow(null), // productId, qty, name,price
      });
      const validatesResult = await Cart_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { cartId } = validatesResult.value;
      if (cartId !== null) {
        const getCart = await Cart.findOne({
          where: {
            id: cartId,
          },
        })
          .then((resp) => {
            return res.status(200).send({
              success: true,
              message: `get all Cart Items`,
              response: resp && resp,
            });
          })
          .catch((error) => {
            return next(
              createHttpError(406, { success: false, message: error.message })
            );
          });
      } else {
        return res.status(200).send({
          success: true,
          message: "Cart Id is Empty",
          // response: resp && resp,
        });
      }
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
  updateAll: async (req, res, next) => {
    try {
      const Cart_joi_schema = Joi.object({
        cartId: Joi.string().allow(null),
        products: Joi.array().required(),
        subTotal: Joi.number().required(),
        total: Joi.number().required(),
        userId: Joi.string().allow(null).trim().default(null),
        deleteCart: Joi.boolean().default(false),
      });
      const validatesResult = await Cart_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { cartId, products, total, userId, deleteCart } =
        validatesResult.value;

      let SubTotal = 0;
      const CalculateSubTotal = products.map((prod) => {
        SubTotal += parseFloat(prod.productPrice);
      });

      if (cartId !== null) {
        const updateCartProducts = await Cart.update(
          {
            products: products,
            subTotal: SubTotal,
            total: total,
            userId: userId,
          },
          {
            where: {
              id: cartId,
            },
            returning: true,
          }
        );
        if (updateCartProducts[1][0].dataValues) {
          const getAllCartItems = await Cart.findOne({
            where: {
              id: updateCartProducts[1][0].dataValues.id,
            },
          })
            .then((resp) => {
              return res.status(200).send({
                success: true,
                message: `Updated Products from CartItems`,
                response: resp && resp.dataValues,
              });
            })
            .catch((error) => {
              return next(
                createHttpError(406, {
                  success: false,
                  message: error.message,
                })
              );
            });
        } else {
          return res.status(200).send({
            success: true,
            message: `Not Updated`,
          });
        }
      }

      if (deleteCart === true) {
        // Product Length is Zero so we delete the Cart
        const deleteCart = await Cart.destroy({
          where: {
            id: cartId,
          },
        })
          .then(() => {
            console.log("Destroy Cart", products);
          })
          .catch((error) => {
            return next(
              createHttpError(406, { success: false, message: error.message })
            );
          });
      }
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
};
