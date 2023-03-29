import { supabase } from "@/supabase/supabase.js";

export async function getAllProducts() {
  const { data, error } = await supabase
    .from("Products")
    .select(
      "id, name, image, price, discount, stock, updated_at, isNovelty, isPresale"
    );
  if (error) {
    console.log(error);
  } else {
    return data;
  }
}

export async function getCartItems(items) {
  const ids = items.map((item) => item.id);
  const { data, error } = await supabase
    .from("Products")
    .select("id, name, image, author, price, discount, stock")
    .in("id", ids);
  if (error) {
    console.log(error);
  } else {
    data.forEach((item) => {
      items.find((i) => {
        if (i.id === item.id) {
          item.amount = i.amount;
        }
      });
    });
    return data;
  }
}

export async function setAsNovelty(id, value) {
  const { error } = await supabase
    .from("Products")
    .update({ isNovelty: value })
    .eq("id", id);
  if (error) console.log(error);
}

export async function setAsPresale(id, value) {
  const { error } = await supabase
    .from("Products")
    .update({ isPresale: value })
    .eq("id", id);
  if (error) console.log(error);
}

export async function searchProducts(value) {
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

export async function getProductDetails(id) {
  const { data, error } = await supabase
    .from("Products")
    .select("*")
    .eq("id", id);
  if (error) {
    console.log(error);
  } else {
    return data[0];
  }
}

export async function getRelatedProducts(categories, name) {
  const { data, error } = await supabase
    .from("Products")
    .select("id, name, image, price, discount, stock")
    .overlaps("categories", categories)
    .neq("name", name);
  if (error) {
    console.log(error);
  } else {
    return data;
  }
}

export async function uploadFile(name, file) {
  const { error } = await supabase.storage
    .from("products")
    .upload("images/" + name, file, {
      cacheControl: "3600",
      upsert: false,
    });
  if (error) console.log(error);
}

export async function deleteFile(name) {
  const { error } = await supabase.storage
    .from("products")
    .remove(["images/" + name]);
  if (error) console.log(error);
}

export async function getFileURL(name) {
  const { data } = supabase.storage
    .from("products")
    .getPublicUrl("images/" + name);
  return data.publicUrl;
}

export async function userIsAdmin(id) {
  const { data: isAdmin, error } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", id);
  if (error) console.log(error);
  else return isAdmin[0].is_admin;
}
