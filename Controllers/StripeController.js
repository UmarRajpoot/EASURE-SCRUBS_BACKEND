import dotenv from "dotenv";
dotenv.config();
import createHttpError from "http-errors";
import Joi from "joi";
import Stripe from "stripe";
import Cart from "../Models/Cart.js";
import Contact from "../Models/Contact.js";
import Orders from "../Models/Orders.js";

import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default {
  stripeConfig: async (req, res, next) => {
    try {
      return res.send({ publishablekey: process.env.STRIPE_PUBLISHABLE_KEY });
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
  createPaymentIntent: async (req, res, next) => {
    try {
      const stripe_payment_joi_schema = Joi.object({
        cartId: Joi.string().required().trim(),
        ShippingCharges: Joi.number().required(),
        GrandTotalShipPrice: Joi.number().required(),
        name: Joi.string().required().trim(),
        email: Joi.string().email().lowercase().required().trim(),
        phone: Joi.string().required().trim(),
        address: Joi.string().required(),
        country: Joi.string().required(),
        state: Joi.string().required(),
        city: Joi.string().required(),
        postalCode: Joi.string().required(),
        gender: Joi.string().required(),
      });
      const validatesResult = await stripe_payment_joi_schema.validateAsync(
        req.body,
        {
          errors: true,
          warnings: true,
        }
      );

      const {
        cartId,
        name,
        email,
        phone,
        address,
        country,
        state,
        city,
        postalCode,
        GrandTotalShipPrice,
        ShippingCharges,
        gender,
      } = validatesResult.value;
      // console.log({
      //   name,
      //   email,
      //   phone,
      //   price,
      //   address,
      //   country,
      //   state,
      //   city,
      //   postalCode,
      // });

      let getCustomer = await stripe.customers
        .search(
          {
            query: `email: "${email}"`,
          },
          { apiKey: process.env.STRIPE_SECRET_KEY }
        )
        .then((resp) => (resp.data[0] !== null ? resp.data[0] : undefined))
        .catch((error) => {
          return next(
            createHttpError(406, { success: false, message: error.message })
          );
        });

      const attatchCart = await Cart.update(
        {
          userId: email,
          total: GrandTotalShipPrice,
          shippingCharges: ShippingCharges,
        },
        {
          where: {
            id: cartId,
          },
          returning: true,
        }
      );
      console.log("Cart is attatched with Email", email);

      const addContact = await Contact.findOrCreate({
        defaults: {
          email: email,
          gender: gender,
        },
        where: {
          email: email,
        },
      });
      console.log("Contact is Created.");

      if (getCustomer?.id !== undefined) {
        console.log("Customer exists", getCustomer.id);

        console.log("Search Payment Intent");
        const paymentIntent = await stripe.paymentIntents.search(
          {
            query: `customer: "${getCustomer.id}"`,
          },
          { apiKey: process.env.STRIPE_SECRET_KEY }
        );
        const checkStatus = paymentIntent.data.filter(
          (payment) => payment.status === "requires_payment_method"
        );
        // console.log(checkStatus);
        if (checkStatus.length !== 0) {
          return res.send({
            message: "You need to Pay.",
            clientSecrets: checkStatus[0]?.client_secret,
          });
        } else if (checkStatus.length === 0) {
          console.log("Need to Create new");
          const paymentIntent = await stripe.paymentIntents.create(
            {
              currency: "usd",
              amount: GrandTotalShipPrice * 100,
              automatic_payment_methods: {
                enabled: true,
              },
              customer: getCustomer.id,
            },
            { apiKey: process.env.STRIPE_SECRET_KEY }
          );
          return res.send({
            message: "New Payment Created.",
            clientSecrets: paymentIntent.client_secret,
          });
        }
        // res.send({ getCustomer });
      } else {
        console.log("Generating new Customer");
        let createCustomer = await stripe.customers.create(
          {
            name: name,
            email: email,
            description: "Order Placed from EASURE.",
            phone: phone,
            address: {
              city: city,
              country: country,
              postal_code: postalCode,
              state: state,
              line1: address,
            },
          },
          { apiKey: process.env.STRIPE_SECRET_KEY }
        );
        res.send({ result: "Success" });
        const paymentIntent = await stripe.paymentIntents.create(
          {
            currency: "usd",
            amount: GrandTotalShipPrice * 100,
            automatic_payment_methods: {
              enabled: true,
            },
            customer: createCustomer.id,
          },
          { apiKey: process.env.STRIPE_SECRET_KEY }
        );
        return res.send({
          clientSecrets: paymentIntent.client_secret,
        });
      }
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
  confitmation: async (req, res, next) => {
    try {
      const Cart_joi_schema = Joi.object({
        paymentId: Joi.string().required(),
        orderId: Joi.string().required().trim(),
      });
      const validatesResult = await Cart_joi_schema.validateAsync(req.body, {
        errors: true,
        warnings: true,
      });

      const { paymentId, orderId } = validatesResult.value;

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentId, {
        apiKey: process.env.STRIPE_SECRET_KEY,
      });

      if (paymentIntent.status === "succeeded") {
        const getOrder = await Orders.findOne({
          where: {
            order_id: orderId,
          },
        });
        if (getOrder.dataValues.emailSended === false) {
          // const msg = {
          //   to: "bitc322@gmail.com", // Change to your recipient
          //   from: "developer.umar500@gmail.com", // Change to your verified sender
          //   subject: "Sending with SendGrid is Fun",
          //   text: "and easy to do anywhere, even with Node.js",
          //   html: "<strong>and easy to do anywhere, even with Node.js</strong>",
          // };
          await sgMail.send({
            to: getOrder.dataValues.email, // Change to your recipient
            from: {
              name: "EASURE",
              email: "developer.umar500@gmail.com",
            },
            personalizations: [
              {
                dynamicTemplateData: {
                  order_id: orderId,
                },
                to: getOrder.dataValues.email,
              },
            ],
            templateId: "d-680d6de7155249b9ad5866c433496a3f",
          });
          console.log("Email sent to", getOrder.dataValues.email);
          const UpdateRecord = await Orders.update(
            {
              status: "paid",
              emailSended: true,
            },
            {
              where: {
                order_id: orderId,
              },
              returning: true,
            }
          )
            .then((resp) => {
              return res.status(200).send({
                success: true,
                message: "Get order detail",
                response: resp[1][0].dataValues && resp[1][0].dataValues,
              });
            })
            .catch((error) => {
              return next(
                createHttpError(406, { success: false, message: error.message })
              );
            });
        } else {
          console.log("Email is Already sended.");
          const UpdateRecord = await Orders.update(
            {
              status: "paid",
              emailSended: true,
            },
            {
              where: {
                order_id: orderId,
              },
              returning: true,
            }
          )
            .then((resp) => {
              return res.status(200).send({
                success: true,
                message: "Get order detail",
                response: resp[1][0].dataValues && resp[1][0].dataValues,
              });
            })
            .catch((error) => {
              return next(
                createHttpError(406, { success: false, message: error.message })
              );
            });
        }
      }
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
};

// "pi_3OmVOXDsONF5GHPk0dtGApr9_secret_dJ2uKNd7i0ckrFZTWEEfmbDSM"
// ?payment_intent=pi_3OnplHDsONF5GHPk2i0tmClw&payment_intent_client_secret=pi_3OnplHDsONF5GHPk2i0tmClw_secret_FWA3lUeBbnCRTipSy63JipVXO&redirect_status=succeeded

// http://localhost:3000/confirmation?payment_intent=pi_3OnplHDsONF5GHPk2i0tmClw&payment_intent_client_secret=pi_3OnplHDsONF5GHPk2i0tmClw_secret_FWA3lUeBbnCRTipSy63JipVXO&redirect_status=succeeded
