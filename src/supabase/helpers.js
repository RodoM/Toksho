import { supabase } from "@/supabase/supabase.js";

async function getAllProducts() {
  const { data, error } = await supabase
    .from("Products")
    .select("id, name, image, price, discount, stock");
  if (error) {
    console.log(error);
  } else {
    return data;
  }
}

async function searchProducts(value) {
  const { data, error } = await supabase
    .from("Products")
    .select()
    .ilike("name", `%${value}%`);
  if (error) {
    console.log(error);
  } else {
    return data;
  }
}

async function getProductDetails(id) {
  const { data, error } = await supabase
    .from("Products")
    .select("*")
    .eq("id", id);
  if (error) {
    console.log(error);
  } else {
    return data;
  }
}

async function orderProductsBy(order, isAscending) {
  const { data, error } = await supabase
    .from("Products")
    .select("*")
    .order(order, { ascending: isAscending });
  if (error) {
    console.log(error);
  } else {
    return data;
  }
}

export default {
  getAllProducts,
  searchProducts,
  getProductDetails,
  orderProductsBy,
};
