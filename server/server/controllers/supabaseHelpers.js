const supabaseClient = require("@supabase/supabase-js");

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseClient.createClient(supabaseUrl, supabaseAnonKey);

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
      status_detail: status_detail,
      transaction_amount: transaction_amount,
      transaction_details: transaction_details,
    }])
    if (error) console.log(error);
  }
  
  async function clearUserCart(id) {
    const { error } = await supabase
    .from("users")
    .update({ cart_items: [] })
    .eq("id", id);
    if (error) console.log(error);
  }
  
  async function getShippingPrice() {
    const { data, error } = await supabase
      .from("Settings")
      .select("value")
      .eq("name", "shipment_price");
    if (error) console.log(error);
    else return data[0].value;
  }

  module.exports = {createOrder, clearUserCart, getShippingPrice}