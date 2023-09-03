const mailer = require("../mails/trackingCodeTemplate");

exports.sendTrackingCode = async (req, res) => {
  try {
    if (req.body) {
      const { mail, trackingCode } = req.body;
      mailer.mail(mail, trackingCode);
    }
    res.status(200).send({succes: true, message: "Código de seguimiento enviado con éxito"});
  } catch (error) {
    console.log(error);
    res.status(403).json({
      success: false,
      message: error.message
    });
  }
  res.send();
}