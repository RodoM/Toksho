require("dotenv").config();

const mercadopago = require("mercadopago");
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

// Setear las backURLS
let preference = {
  items: undefined,
  // Calcular envio
  shipments:{
    cost: 1000,
    mode: "not_specified",
  },
  back_urls: {
    "success": "http://localhost:5173",
    "failure": "http://localhost:5173/carrito",
    "pending": "http://localhost:5173/preguntas"
  },
};

exports.setData = (req, res) => {
  try {
    preference.items = req.body;
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
    res.status(200).send(response.body)
  })
  .catch(function (error) {
    console.log(error);
    res.status(403).json({
      success: true,
      message: "Error al generar el id de preferencia"
    });
  });
}
