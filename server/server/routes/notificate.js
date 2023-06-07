const express = require("express");
const controller = require("../controllers/notificate");
const router = express.Router();

router.post(
  '/notificate',
  controller.getNotification
)

module.exports = router;