const express = require("express");
const controller = require("../controllers/preference");
const router = express.Router();

router.post(
  '/preference',
  controller.setData
  )
  
router.get(
  '/preference',
  controller.getData
)

module.exports = router;