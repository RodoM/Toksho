require("dotenv").config();
const {createOrder, updateItemsStock, clearUserCart, getShippingPrice} = require("../helpers/supabaseHelpers");
const mailer = require("../mails/orderTemplate");

const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

exports.getNotification = async (req, res) => {
  try {
    if (req.body.data) {
      const shippingPrice = await getShippingPrice();
      const res = await mercadopago.payment.findById(req.body.data.id);
  
      const { 
        additional_info, date_created, date_last_updated, id, order, payer, metadata, payment_type_id, status, status_detail, transaction_amount, transaction_details
      } = res.body;
  
      await createOrder(id, metadata.user_id, additional_info.items, metadata.payer, date_created, date_last_updated, order, payer, payment_type_id, status, status_detail, transaction_amount, transaction_details);
      if (status === "approved" || status === "pending") {
        await updateItemsStock(additional_info.items);
        await clearUserCart(metadata.user_id);
        localStorage.removeItem("items");
        mailer.mail(id, metadata.payer.name, metadata.payer.email, additional_info.items, metadata.payer.address, shippingPrice);
      }
    }
    res.status(200).send({succes: true, message: "Orden creada con éxito"});
  } catch (error) {
    console.log(error);
    res.status(403).json({
      success: false,
      message: error.message
    });
  }
  res.send();
}