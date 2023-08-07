import Joi from "joi";
import createHttpError from "http-errors";
import Orders from "../Models/Orders.js";

export default {
  addOrder: async (req, res, next) => {
    try {
      const Order_joi_schema = Joi.object({
        country: Joi.string().required().trim(),
        firstname: Joi.string().required().trim(),
        lastname: Joi.string().required().trim(),
        address: Joi.string().required().trim(),
        city: Joi.string().required().trim(),
        state: Joi.string().required().trim(),
        zipcode: Joi.string().required().trim(),
        phone: Joi.string().required().trim(),
        orderItems: Joi.array().required(),
      });
      const validatesResult = await Order_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const {
        country,
        firstname,
        lastname,
        address,
        city,
        state,
        zipcode,
        phone,
        orderItems,
      } = validatesResult.value;

      const AddOrder = await Orders.create({
        country: country,
        firstname: firstname,
        lastname: lastname,
        address: address,
        city: city,
        state: state,
        zipcode: zipcode,
        phone: phone,
        orderItems: orderItems,
      })
        .then((resp) => {
          return res.status(201).send({
            success: true,
            message: "Order Successfully Added",
            response: resp.dataValues,
          });
        })
        .catch((error) => {
          return next(
            createHttpError(403, {
              success: false,
              message: error.errors[0].message,
            })
          );
        });
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
  deleteColor: async (req, res, next) => {
    try {
      const Order_joi_schema = Joi.object({
        orderid: Joi.string().required().trim(),
      });
      const validatesResult = await Order_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { orderid } = validatesResult.value;

      const delOrder = await Orders.destroy({
        where: {
          id: orderid,
        },
      })
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: `Order Successfully Deleted.`,
          });
        })
        .catch((error) => {
          return next(
            createHttpError(406, { success: false, message: error.message })
          );
        });
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
  getallOrders: async (req, res, next) => {
    try {
      const getAllOrders = await Orders.findAll()
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: "Get all Orders",
            response: resp,
          });
        })
        .catch((error) => {
          return next(
            createHttpError(406, { success: false, message: error.message })
          );
        });
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
};
