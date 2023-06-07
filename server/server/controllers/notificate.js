require("dotenv").config();
const supabaseClient = require("@supabase/supabase-js");

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseClient.createClient(supabaseUrl, supabaseAnonKey);

const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

async function createOrder(id, user_id, items, payer, created, updated, order, payer_mp, payment_type, status, status_detail, transaction_amount, transaction_details) {
  const { data, error } = await supabase
  .from('Orders')
  .insert([{
    id: id,
    user_id: user_id,
    items: items,
    payer: payer,
    date_created: created,
    date_last_updated: updated,
    order: order,
    payer_mp: payer_mp,
    payment_type: payment_type,
    status: status,
    status_detail: status,
    transaction_amount: transaction_amount,
    transaction_details: transaction_details,
  }])
  if (error) console.log(error);
}

exports.getNotification = (req, res) => {
  if (req.body.data) {
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
    })
  }
  res.send();
}