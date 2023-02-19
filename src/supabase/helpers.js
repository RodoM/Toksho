import { supabase } from "@/supabase/supabase.js";

async function getAllProducts() {
  const { data, error } = await supabase.from("Products").select("*");
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

export default { getAllProducts, searchProducts };
