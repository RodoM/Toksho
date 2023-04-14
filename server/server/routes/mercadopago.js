const express = require("express");
const controller = require("../controllers/mercadopago");
const router = express.Router();

const path = "preference";

router.post(
  `/${path}`,
  controller.setData
  )
  
router.get(
  `/${path}`,
  controller.getData
)

module.exports = router;