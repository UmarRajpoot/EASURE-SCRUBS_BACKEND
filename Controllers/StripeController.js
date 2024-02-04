import createHttpError from "http-errors";
import Stripe from "stripe";

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
      let createCustomer = await stripe.customers
        .create(
          {
            name: "Umar Saleem",
            email: "bitc322@gmail.com",
            description: "THis is the description of customer",
            address: {
              country: "Pakistan",
              city: "khewra",
              state: "punjab",
              postal_code: "49060",
              line1: "J-56",
            },
            phone: "03404960397",
            shipping: {
              name: "Umar Saleem",
              phone: "03404960397",
              address: "j-56",
            },
          },
          { apiKey: process.env.STRIPE_SECRET_KEY }
        )
        .then((resp) => {
          res.send({ customer: resp });
        });
      // const paymentIntent = await stripe.paymentIntents.create(
      //   {
      //     currency: "usd",
      //     amount: 30 * 100,
      //     automatic_payment_methods: {
      //       enabled: true,
      //     },
      //     customer: createCustomer.id,
      //   },
      //   { apiKey: process.env.STRIPE_SECRET_KEY }
      // );
      // return res.send({ clientSecrets: paymentIntent.client_secret });
    } catch (error) {
      return next(
        createHttpError(406, { success: false, message: error.message })
      );
    }
  },
};
