require('dotenv').config();
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

let preference = {
  items: undefined,
  payer: undefined,
  metadata: {
    payer: undefined,
    user_id: undefined,
  },
  shipments:{
    cost: undefined,
    mode: "not_specified",
  },
  payment_methods: {
    "installments": 1,
    "excluded_payment_types": [
      { "id": "ticket" }
    ]
  },
  back_urls: {
    "success": process.env.VITE_API_FONT_URL,
    "failure": `${process.env.VITE_API_FONT_URL}/carrito`,
    "pending": process.env.VITE_API_FONT_URL
  },
  notification_url: `${process.env.VITE_API_BACK_URL}/notificate`
};

exports.setData = (req, res) => {
  try {
    preference.items = req.body.items;
    preference.payer = req.body.payer;
    preference.metadata.payer = req.body.payer;
    preference.metadata.user_id = req.body.payer.id;
    preference.shipments.cost = req.body.shipment;
    res.status(200).send({succes: true, message: "Preferencia recibida con éxito"});
  } catch(error) {
    console.log(error);
    res.status(403).json({
      success: false,
      message: error.message
    });
  }
}

exports.getData = (req, res) => {
  mercadopago.preferences.create(preference)
    .then(function (response) {
      res.json(response.body)
    })
    .catch(function (error) {
      console.log(error);
      res.status(403).json({
        success: true,
        message: error.message
      });
    });
}
