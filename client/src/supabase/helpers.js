import { supabase } from "@/supabase/supabase.js";

export async function getSessionData() {
  const { data, error } = await supabase.auth.getSession();
  if (error) console.log(error);
  else return data;
}

export async function getAllProducts(offset, limit, filter) {
  const { name, type, author, categorie, order, asc } = filter.value;
  let query = supabase
    .from("Products")
    .select("id, name, image, price, discount, stock", {
      count: "exact",
    })
    .range(offset, limit);
  if (name) query = query.ilike("name", `%${name}%`);
  if (type) query = query.eq("type", type);
  if (author) query = query.eq("author", author);
  if (categorie) query = query.overlaps("categories", [categorie]);
  if (order) query = query.order(order, { ascending: asc });
  const { data, count, error } = await query;
  if (error) console.log(error);
  else return { data, count };
}

export async function getAllProductsAdmin(offset, limit, filter) {
  const { name, type, author, categorie, order, asc } = filter.value;
  let query = supabase
    .from("Products")
    .select("id, name, author, price, discount, stock, isNovelty, isPresale", {
      count: "exact",
    })
    .range(offset, limit);
  if (name) query = query.ilike("name", `%${name}%`);
  if (type) query = query.eq("type", type);
  if (author) query = query.eq("author", author);
  if (categorie) query = query.overlaps("categories", [categorie]);
  if (order) query = query.order(order, { ascending: asc });
  const { data, count, error } = await query;
  if (error) console.log(error);
  else return { data, count };
}

export async function getAllOrders() {
  let { data, error } = await supabase
    .from("Orders")
    .select("*")
    .order("date_created", { ascending: false });
  if (error) console.log(error);
  else return data;
}

export async function getNews() {
  let { data, error } = await supabase.from("News").select("*");
  if (error) console.log(error);
  else return data;
}

export async function getAllAuthors() {
  let authorsArr = [];
  const { data: Authors, error } = await supabase
    .from("Products")
    .select("author");
  if (error) console.log(error);
  else {
    Authors.forEach((author) => {
      authorsArr.push(author.author);
    });
    return [...new Set(authorsArr)];
  }
}

export async function getAllCategories() {
  let categoriesArr = [];
  const { data: Categories, error } = await supabase
    .from("Products")
    .select("categories");
  if (error) console.log(error);
  else {
    Categories.forEach((cat) => {
      cat.categories.forEach((c) => {
        categoriesArr.push(c);
      });
    });
    return [...new Set(categoriesArr)];
  }
}

export async function getAuthorPrices(author) {
  let pricesArr = [];
  const { data: Prices, error } = await supabase
    .from("Products")
    .select("price")
    .eq("author", author);
  if (error) console.log(error);
  else {
    Prices.forEach((price) => {
      pricesArr.push(price.price);
    });
    return [...new Set(pricesArr)].sort();
  }
}

export async function changeAllPrices(author, price, newPrice) {
  const { data, error } = await supabase
    .from("Products")
    .update({ price: newPrice })
    .eq("author", author)
    .eq("price", price)
    .select();
  if (error) console.log(error);
  else return data;
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

export async function getNovelties() {
  const { data, error } = await supabase
    .from("Products")
    .select("id, name, image, price, discount, stock")
    .eq("isNovelty", true);
  if (error) console.log(error);
  else return data;
}

export async function setAsPresale(id, value) {
  const { error } = await supabase
    .from("Products")
    .update({ isPresale: value })
    .eq("id", id);
  if (error) console.log(error);
}

export async function getPresales() {
  const { data, error } = await supabase
    .from("Products")
    .select("id, name, image, price, discount, stock")
    .eq("isPresale", true);
  if (error) console.log(error);
  else return data;
}

export async function searchProducts(value) {
  const { data, count, error } = await supabase
    .from("Products")
    .select(
      "id, name, image, price, discount, stock, updated_at, isNovelty, isPresale",
      { count: "exact" }
    )
    .ilike("name", `%${value}%`);
  if (error) {
    console.log(error);
  } else {
    return { data, count };
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
    let res = data.slice(0, 30).sort(() => Math.random() - 0.5);
    return res.slice(0, 6);
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

export async function deleteProduct(id) {
  const { error } = await supabase.from("Products").delete().eq("id", id);
  if (error) return error;
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

export async function getMaintenance() {
  const { data, error } = await supabase
    .from("Settings")
    .select("active")
    .eq("name", "maintenance");
  if (error) console.log(error);
  else return data[0].active;
}

export async function setMaintenance(active) {
  const { error } = await supabase
    .from("Settings")
    .update({ active: active })
    .eq("name", "maintenance")
    .select();
  if (error) return error;
}

export async function getShippingPrice() {
  const { data, error } = await supabase
    .from("Settings")
    .select("value")
    .eq("name", "shipment_price");
  if (error) console.log(error);
  else return data[0].value;
}

export async function setShippingPrice(value) {
  const { error } = await supabase
    .from("Settings")
    .update({ value: value })
    .eq("name", "shipment_price")
    .select();
  if (error) return error;
}
