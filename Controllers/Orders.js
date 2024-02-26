import Joi from "joi";
import createHttpError from "http-errors";
import Orders from "../Models/Orders.js";

export default {
  addOrder: async (req, res, next) => {
    try {
      const Order_joi_schema = Joi.object({
        email: Joi.string().required().trim(),
        country: Joi.string().required().trim(),
        firstname: Joi.string().required().trim(),
        lastname: Joi.string().required().trim(),
        address: Joi.string().required().trim(),
        city: Joi.string().required().trim(),
        state: Joi.string().required().trim(),
        zipcode: Joi.string().required().trim(),
        phone: Joi.string().required().trim(),
        orderItems: Joi.array().required(),
        //
        subTotal: Joi.number().required(),
        total: Joi.number().required(),
        shippingCharges: Joi.number().required(),
        gender: Joi.string().required().trim(),
      });

      const validatesResult = await Order_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const {
        email,
        country,
        firstname,
        lastname,
        address,
        city,
        state,
        zipcode,
        phone,
        orderItems,
        //
        subTotal,
        total,
        shippingCharges,
        gender,
      } = validatesResult.value;

      const AddOrder = await Orders.create({
        order_id: Math.random().toString(16).slice(8),
        email: email,
        country: country,
        firstname: firstname,
        lastname: lastname,
        address: address,
        city: city,
        state: state,
        zipcode: zipcode,
        phone: phone,
        orderItems: orderItems,
        subTotal,
        total,
        shippingCharges,
        gender: gender,
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
  getOrderById: async (req, res, next) => {
    try {
      const Order_joi_schema = Joi.object({
        orderId: Joi.string().required().trim(),
      });
      const validatesResult = await Order_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { orderId } = validatesResult.value;

      const getOrder = await Orders.findOne({
        where: {
          order_id: orderId,
        },
      })
        .then((resp) => {
          return res.status(200).send({
            success: true,
            message: "Get order detail",
            response: resp && resp.dataValues,
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
