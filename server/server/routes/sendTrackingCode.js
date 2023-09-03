const express = require("express");
const controller = require("../controllers/sendTrackingCode");
const router = express.Router();

router.post(
  '/sendTrackingCode',
  controller.sendTrackingCode
)

module.exports = router;