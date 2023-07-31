require("dotenv").config();
const {createOrder, clearUserCart, getShippingPrice} = require("./supabaseHelpers");
const mailer = require("./mailer");

const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

exports.getNotification = async (req, res) => {
  if (req.body.data) {
    const shippingPrice = await getShippingPrice();
    mercadopago.payment.findById(req.body.data.id).then(res => {
      const {
        additional_info,
        date_created,
        date_last_updated,
        id,
        order,
        payer,
        metadata,
        payment_type_id,
        status,
        status_detail,
        transaction_amount,
        transaction_details
      } = res.body;
      createOrder(
        id,
        metadata.user_id,
        additional_info.items,
        metadata.payer,
        date_created,
        date_last_updated,
        order,
        payer,
        payment_type_id,
        status,
        status_detail,
        transaction_amount,
        transaction_details
      );
      if (status === 'approved') {
        clearUserCart(metadata.user_id);
        mailer.mail(id, metadata.payer.name, metadata.payer.email, additional_info.items, metadata.payer.address, shippingPrice);
      }
    })
  }
  res.send();
}