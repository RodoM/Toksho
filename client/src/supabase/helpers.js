import { supabase } from "@/supabase/supabase.js";
import { showToast } from "@/lib/composables/toastHelper";

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
    .eq("isPublished", true)
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
    .select("id, name, author, image, price, discount, stock, isNovelty, isPresale, isPublished", {
      count: "exact",
    })
    .range(offset, limit);
  if (name) query = query.ilike("name", `%${name}%`);
  if (type && type !== "all") query = query.eq("type", type);
  if (author) query = query.eq("author", author);
  if (categorie) query = query.overlaps("categories", [categorie]);
  if (order) query = query.order(order, { ascending: asc });
  const { data, count, error } = await query;
  if (error) console.log(error);
  else return { data, count };
}

export async function getAllOrders(offset, limit, filter) {
  const { orderId, state, order, asc } = filter.value;
  let query = supabase.from("Orders").select("*", { count: "exact" }).range(offset, limit);
  if (orderId) query = query.ilike("id", `%${orderId}%`);
  if (state && state !== "all") query = query.eq("status", state);
  if (order === "surname") query = query.order("payer->surname", { ascending: asc });
  else if (order) query = query.order(order, { ascending: asc });
  const { data, count, error } = await query;
  if (error) console.log(error);
  else return { data, count };
}

export async function getSlides() {
  let { data, error } = await supabase.from("Slides").select("*");
  if (error) console.log(error);
  else return data;
}

export async function createSlide(image, primaryText, secondaryText) {
  let date = new Date();
  date = String(date.getTime());

  const { error: storageErr } = await supabase.storage.from("slides").upload("images/" + date, image, {
    cacheControl: "3600",
    upsert: false,
  });
  if (storageErr) console.log(storageErr);

  const { data: storageData } = supabase.storage.from("slides").getPublicUrl("images/" + date);
  const imageURL = storageData.publicUrl;

  const { error } = await supabase.from("Slides").insert([
    {
      image: imageURL,
      primary_text: primaryText,
      secondary_text: secondaryText,
      updated_at: date,
    },
  ]);
  if (error) console.log(error);
}

export async function deleteSlide(id, image) {
  const { error: storageErr } = await supabase.storage.from("slides").remove(["images/" + image]);
  if (storageErr) console.log(storageErr);

  const { error } = await supabase.from("Slides").delete().eq("id", id);
  if (error) return error;
}

export async function getAllAuthors() {
  let authorsArr = [];
  const { data: Authors, error } = await supabase.from("Products").select("author");
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
  const { data: Categories, error } = await supabase.from("Products").select("categories");
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

export async function getAllEditorials() {
  let editorials = [];
  const { data, error } = await supabase.from("Products").select("editorial").neq("editorial", null);
  if (error) console.log(error);
  else {
    data.forEach((editorial) => {
      editorials.push(editorial.editorial);
    });
    return [...new Set(editorials)];
  }
}

export async function getEditorialSizes(editorial) {
  let editorialSizes = [];
  const { data, error } = await supabase.from("Products").select("size").eq("editorial", editorial).neq("size", null);
  if (error) console.log(error);
  else {
    data.forEach((size) => {
      editorialSizes.push(size.size);
    });
    return [...new Set(editorialSizes)];
  }
}

export async function getEditorialSizePrice(editorial, size) {
  let prices = [];
  const { data, error } = await supabase.from("Products").select("price").eq("editorial", editorial).eq("size", size);
  if (error) console.log(error);
  else {
    data.forEach((price) => {
      prices.push(price.price);
    });
    return [...new Set(prices)];
  }
}

export async function changePrice(editorial, size, oldPrice, newPrice) {
  try {
    await supabase.from("Products").update({ price: newPrice }).eq("editorial", editorial).eq("size", size).eq("price", oldPrice);
    showToast("Se actualizó correctamente los precios", "success");
  } catch (error) {
    showToast("Error al actualizar los precios", "error");
  }
}

export async function getCartItems(items) {
  const ids = items.map((item) => item.id);
  const { data, error } = await supabase.from("Products").select("id, name, image, author, price, discount, stock").in("id", ids);
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
  const { error } = await supabase.from("Products").update({ isNovelty: value }).eq("id", id);
  if (error) console.log(error);
}

export async function getNovelties() {
  const { data, error } = await supabase.from("Products").select("id, name, image, price, discount, stock").eq("isNovelty", true);
  if (error) console.log(error);
  else return data;
}

export async function setAsPresale(id, value) {
  const { error } = await supabase.from("Products").update({ isPresale: value }).eq("id", id);
  if (error) console.log(error);
}

export async function handlePublish(id, value) {
  const { error } = await supabase.from("Products").update({ isPublished: value }).eq("id", id);
  if (error) console.log(error);
}

export async function getPresales() {
  const { data, error } = await supabase.from("Products").select("id, name, image, price, discount, stock").eq("isPresale", true);
  if (error) console.log(error);
  else return data;
}

export async function searchProducts(value) {
  const { data, count, error } = await supabase
    .from("Products")
    .select("id, name, image, price, discount, stock, isNovelty, isPresale", { count: "exact" })
    .ilike("name", `%${value}%`);
  if (error) {
    console.log(error);
  } else {
    return { data, count };
  }
}

export async function getProductDetails(id) {
  const { data, error } = await supabase.from("Products").select("*").eq("id", id);
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

export async function createProduct(type, name, image, size, author, editorial, categories, price, discount, stock, description) {
  const { error } = await supabase
    .from("Products")
    .insert([{ type, name, image, size, author, editorial, categories, price, discount, stock, description }]);
  if (error) console.log(error);
}

export async function updateProduct(id, type, name, image, size, author, editorial, categories, price, discount, stock, description) {
  try {
    await supabase
      .from("Products")
      .update({
        type: type,
        name: name,
        image: image,
        size: size,
        author: author,
        editorial: editorial,
        categories: categories,
        price: price,
        discount: discount,
        stock: stock,
        description: description,
      })
      .eq("id", id);
    showToast("Se editó correctamente el producto", "success");
  } catch (error) {
    console.log(error);
    // Manejar los distintos error messages
    showToast("Error al editar el producto", "error");
  }
}

export async function uploadFile(author, name, file) {
  const time = new Date().getTime();
  const { error } = await supabase.storage.from("products").upload(`${author.toLowerCase()}/${name.toLowerCase()}-${time}`, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) console.log(error);
  else {
    const { data, error } = supabase.storage.from("products").getPublicUrl(`${author.toLowerCase()}/${name.toLowerCase()}-${time}`);
    if (error) console.log(error);
    else return data.publicUrl;
  }
}

export async function deleteFile(image) {
  const { error } = await supabase.storage.from("products").remove([image]);
  if (error) console.log(error);
}

export async function deleteProduct(id) {
  const { error } = await supabase.from("Products").delete().eq("id", id);
  if (error) return error;
}

export async function userIsAdmin(id) {
  const { data: isAdmin, error } = await supabase.from("users").select("is_admin").eq("id", id);
  if (error) console.log(error);
  else return isAdmin[0].is_admin;
}

export async function getUser(id) {
  const { data, error } = await supabase.from("users").select("first_name, last_name, email, phone, address").eq("id", id);
  if (error) console.log(error);
  else return data[0];
}

export async function updateUser(id, data) {
  const { error } = await supabase
    .from("users")
    .update({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
    })
    .eq("id", id);
  if (error) return error;
}

export async function addToUserCart(items, id) {
  const { error } = await supabase.from("users").update({ cart_items: items }).eq("id", id);
  if (error) return error;
}

export async function getUserCart(id) {
  const { data, error } = await supabase.from("users").select("cart_items").eq("id", id);
  if (error) console.log(error);
  else return data[0].cart_items;
}

export async function getUserOrders(id) {
  const { data, error } = await supabase
    .from("Orders")
    .select("*")
    .eq("user_id", id)
    .order("date_created", { ascending: false })
    .range(0, 4);
  if (error) console.log(error);
  else return data;
}

export async function getMaintenance() {
  const { data, error } = await supabase.from("Settings").select("active").eq("name", "maintenance");
  if (error) console.log(error);
  else return data[0].active;
}

export async function setMaintenance(active) {
  const { error } = await supabase.from("Settings").update({ active: active }).eq("name", "maintenance").select();
  if (error) return error;
}

export async function getShippingPrice() {
  const { data, error } = await supabase.from("Settings").select("value").eq("name", "shipment_price");
  if (error) console.log(error);
  else return data[0].value;
}

export async function setShippingPrice(value) {
  const { error } = await supabase.from("Settings").update({ value: value }).eq("name", "shipment_price").select();
  if (error) return error;
}
