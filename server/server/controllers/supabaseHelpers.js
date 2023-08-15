const supabaseClient = require("@supabase/supabase-js");

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseClient.createClient(supabaseUrl, supabaseAnonKey);

async function createOrder(id, user_id, items, payer, created, updated, order, payer_mp, payment_type, status, status_detail, transaction_amount, transaction_details) {
  try {
    await supabase
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
  } catch (error) {
    console.log(error);
  }
}

async function updateItemsStock(items) {
  try {
    const formatedItems = items.map((item) => {
      return {
        id: item.id,
        quantity: parseInt(item.quantity, 10)
      };
    });
    console.log(formatedItems);
    await supabase.rpc('update_product_stock', { p_products: formatedItems });
  } catch (error) {
    console.log(error);
  }
}
  
async function clearUserCart(id) {
  try {
    await supabase.from("users").update({ cart_items: [] }).eq("id", id);
  } catch (error) {
    console.log(error);
  }
}

async function getShippingPrice() {
  try {
    const { data } = await supabase.from("Settings").select("value").eq("name", "shipment_price");
    return data[0].value;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {createOrder, updateItemsStock, clearUserCart, getShippingPrice}