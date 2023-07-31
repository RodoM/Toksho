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
  back_urls: {
    "success": process.env.API_BASE_URL,
    "failure": `${process.env.API_BASE_URL}/carrito`,
    "pending": process.env.API_BASE_URL
  },
  notification_url: `${process.env.API_BASE_URL}/notificate`
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
      message: "Error al recibir la preferencia"
    });
  }
}

exports.getData = (req, res) => {
  mercadopago.preferences
  .create(preference)
  .then(function (response) {
    res.json(response.body)
  })
  .catch(function (error) {
    console.log(error);
    res.status(403).json({
      success: true,
      message: "Error al generar el id de preferencia"
    });
  });
}
