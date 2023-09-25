import { supabase } from "@/supabase/supabase.js";
import { showToast } from "@/lib/composables/toastHelper";
import router from "../router";

// --------------- Session functions ---------------
// GET functions
// Gets the session data.
export async function getSessionData() {
  try {
    const { data } = await supabase.auth.getSession();
    return data;
  } catch (error) {
    showToast("Se produjó un error inesperado", "error");
  }
}

// Gets cart items.
export async function getCartItems(items) {
  try {
    const ids = items.map((item) => item.id);
    const { data } = await supabase
      .from("Products")
      .select("id, name, image, author, price, discount, stock")
      .in("id", ids)
      .gte("stock", 1)
      .eq("isPublished", true);
    data.forEach((item) => {
      items.find((i) => {
        if (i.id === item.id) {
          item.amount = i.amount;
        }
      });
    });
    if (ids.length !== data.length) {
      showToast("Uno o más productos fueron retirados de tu carrito debido a que no contaban con stock", "warning");
    }
    return data;
  } catch (error) {
    showToast("Error al solicitar los productos del carrito", "error");
  }
}

// SET functions
// Registers
export async function register(email, password) {
  try {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) throw new Error(error);
    showToast("Registro exitoso, revisa tu email", "success");
    router.push({ name: "Login" });
  } catch (error) {
    showToast("Error al registrarse", "error");
  }
}

// Login.
export async function login(email, password) {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) throw new Error(error);
    showToast("Inicio de sesión exitoso", "success");
    router.push({ name: "Home" });
  } catch (error) {
    if (error.message.includes("Invalid")) showToast("Credenciales invalidas", "error");
    else showToast("Error al inicar sesión", "error");
  }
}

// Logout.
export async function logout() {
  try {
    await supabase.auth.signOut();
    showToast("Cierre de sesión exitoso", "success");
  } catch (error) {
    showToast("Error al cerrar sesión", "error");
  }
}

// Sends reset password
export async function sendForgotPassword(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error);
    showToast("Se te envió un correo para recuperar tu contraseña", "success");
    router.push({ name: "Home" });
  } catch (error) {
    showToast("Error al recuperar contraseña", "error");
  }
}

// Changes password
export async function updatePassword(password) {
  try {
    await supabase.auth.updateUser({
      password: password,
    });
    showToast("Contraseña actualizada correctamente", "success");
    router.push({ name: "Home" });
  } catch (error) {
    showToast("Error al actualizar contraseña", "error");
  }
}

// --------------- Settings functions ---------------
// GET functions
// Gets the maintenance status.
export async function getMaintenance() {
  try {
    const { data } = await supabase.from("Settings").select("active").eq("name", "maintenance");
    return data[0].active;
  } catch (error) {
    showToast("Se produjó un error inesperado", "error");
  }
}

// Gets the slides for the carrousel.
export async function getSlides() {
  try {
    const { data } = await supabase.from("Slides").select("*");
    return data;
  } catch (error) {
    showToast("Se produjó un error inesperado", "error");
  }
}

// SET functions
// Sets the maintenance status.
export async function setMaintenance(active) {
  try {
    await supabase.from("Settings").update({ active: active }).eq("name", "maintenance").select();
    showToast("Se actualizó el estado de mantenimiento de la página", "success");
  } catch (error) {
    showToast("Error al actualizar el estado de mantenimiento", "error");
  }
}

// Creates a new slide for the carrousel.
export async function createSlide(image, primaryText, secondaryText) {
  const time = new Date().getTime();
  try {
    const { error: uploadError } = await supabase.storage.from("slides").upload("images/" + time, image, {
      cacheControl: "3600",
      upsert: false,
    });
    if (uploadError) throw new Error("Error al cargar la imágen");

    const { data, error: urlError } = supabase.storage.from("slides").getPublicUrl("images/" + time);
    if (urlError) throw new Error("Error al obtener el URL de la imágen");
    const imageURL = data.publicUrl;

    const { error: insertError } = await supabase
      .from("Slides")
      .insert([{ image: imageURL, primary_text: primaryText, secondary_text: secondaryText, updated_at: time }]);
    if (insertError) throw new Error("Error al crear la slide");

    showToast("Se agregó correctamente la slide", "success");
  } catch (error) {
    showToast(error.message, "error");
  }
}

// Deletes a slide.
export async function deleteSlide(id, image) {
  try {
    const { error: removeError } = await supabase.storage.from("slides").remove(["images/" + image]);
    if (removeError) throw new Error("Error al eliminar la imágen");

    const { error: deleteError } = await supabase.from("Slides").delete().eq("id", id);
    if (deleteError) throw new Error("Error al eliminar la slide");

    showToast("Se eliminó correctamente la slide", "success");
  } catch (error) {
    showToast(error.message, "error");
  }
}

// --------------- User functions ---------------
// GET functions
// Gets the user data.
export async function getUser(id) {
  try {
    const { data } = await supabase.from("users").select("first_name, last_name, email, phone").eq("id", id);
    return data[0];
  } catch (error) {
    showToast("Se produjó un error inesperado", "error");
  }
}

// Gets if the user is an admin.
export async function userIsAdmin(id) {
  try {
    const { data } = await supabase.from("users").select("is_admin").eq("id", id);
    return data[0].is_admin;
  } catch (error) {
    showToast("Se produjó un error inesperado", "error");
  }
}

// Gets the user cart items.
export async function getUserCart(id) {
  try {
    const { data } = await supabase.from("users").select("cart_items").eq("id", id);
    return data[0].cart_items;
  } catch (error) {
    showToast("Error al solicitar los productos del carrito", "error");
  }
}

// Gets the user orders.
export async function getUserOrders(id) {
  try {
    const { data } = await supabase.from("Orders").select("*").eq("user_id", id).order("date_created", { ascending: false }).range(0, 4);
    return data;
  } catch (error) {
    showToast("Error al solicitar las ordenes del usuario", "error");
  }
}

// SET functions
// Updates user data.
export async function updateUser(id, data) {
  try {
    await supabase
      .from("users")
      .update({ first_name: data.first_name, last_name: data.last_name, email: data.email, phone: data.phone })
      .eq("id", id);
    showToast("Datos actualizados con éxito", "success");
  } catch (error) {
    showToast("Error al actualizar los datos del usuario", "error");
  }
}

// Adds product to the user cart.
export async function updateUserCart(items, id, deleted) {
  try {
    await supabase.from("users").update({ cart_items: items }).eq("id", id);
    if (deleted) showToast("Se eliminó el producto del carrito", "success");
    else showToast("Se agregó el producto al carrito", "success");
  } catch (error) {
    showToast("Error al agregar el producto al carrito", "error");
  }
}

// --------------- Product functions ---------------
// GET functions
// Gets the products with the id, name, image, price, discount and stock columns.
export async function getAllProducts(offset, limit, filter) {
  try {
    const { name, type, author, categorie, order, asc } = filter.value;
    let query = supabase
      .from("Products")
      .select("id, name, image, imageSmall, price, discount, stock", { count: "exact" })
      .eq("isPublished", true)
      .range(offset, limit);
    if (name) query = query.ilike("name", `%${name}%`);
    if (type) query = query.eq("type", type);
    if (author) query = query.overlaps("author", [author]);
    if (categorie) query = query.overlaps("categories", [categorie]);
    if (order) query = query.order(order, { ascending: asc });
    const { data, count } = await query;
    return { data, count };
  } catch (error) {
    showToast("Se produjó un error inesperado", "error");
  }
}

// Gets the products with the id, name, author, image, price, discount, stock, isNovelty, isPresale and isPublished columns.
export async function getAllProductsAdmin(offset, limit, filter) {
  try {
    const { name, type, author, categorie, order, asc } = filter.value;
    let query = supabase
      .from("Products")
      .select("id, name, author, image, imageSmall, price, discount, stock, isNovelty, isPresale, isPublished", {
        count: "exact",
      })
      .range(offset, limit);
    if (name) query = query.ilike("name", `%${name}%`);
    if (type && type !== "all") query = query.eq("type", type);
    if (author) query = query.overlaps("author", [author]);
    if (categorie) query = query.overlaps("categories", [categorie]);
    if (order) query = query.order(order, { ascending: asc });
    const { data, count } = await query;
    return { data, count };
  } catch (error) {
    showToast("Se produjó un error inesperado", "error");
  }
}

// Gets the desire product details called with the id.
export async function getProductDetails(id) {
  try {
    const { data } = await supabase.from("Products").select("*").eq("id", id);
    return data[0];
  } catch (error) {
    showToast("Se produjó un error inesperado", "error");
    router.push({ name: "Products" });
  }
}

// Gets related products according to the categories excluding the current product.
export async function getRelatedProducts(categories, name) {
  try {
    const { data } = await supabase
      .from("Products")
      .select("id, name, image, price, discount, stock")
      .overlaps("categories", categories)
      .eq("isPublished", true)
      .neq("name", name);
    let res = data.slice(0, 30).sort(() => Math.random() - 0.5);
    return res.slice(0, 6);
  } catch (error) {
    showToast("Se produjó un error inesperado", "error");
  }
}

// Gets the products according to te search criteria.
export async function searchProducts(value) {
  try {
    const { data, count } = await supabase
      .from("Products")
      .select("id, name, image, price, discount, stock, isNovelty, isPresale", { count: "exact" })
      .ilike("name", `%${value}%`);
    return { data, count };
  } catch (error) {
    showToast("Se produjó un error inesperado", "error");
  }
}

// Gets the products that are novelties.
export async function getNovelties() {
  try {
    const { data } = await supabase
      .from("Products")
      .select("id, name, image, price, discount, stock")
      .eq("isNovelty", true)
      .eq("isPublished", true);
    return data;
  } catch (error) {
    showToast("Se produjó un error inesperado", "error");
  }
}

// Gets the products that are presales.
export async function getPresales() {
  try {
    const { data } = await supabase
      .from("Products")
      .select("id, name, image, price, discount, stock")
      .eq("isPresale", true)
      .eq("isPublished", true);
    return data;
  } catch (error) {
    showToast("Se produjó un error inesperado", "error");
  }
}

// Gets all the products authors.
export async function getAllAuthors() {
  try {
    const { data } = await supabase.from("Products").select("author");
    const authors = data.flatMap((author) => author.author);
    return [...new Set(authors)];
  } catch (error) {
    showToast("Se produjó un error inesperado", "error");
  }
}

// Gets all the published products authors.
export async function getAllPublishedAuthors() {
  try {
    const { data } = await supabase.from("Products").select("author").eq("isPublished", true);
    const authors = data.flatMap((author) => author.author);
    return [...new Set(authors)];
  } catch (error) {
    showToast("Se produjó un error inesperado", "error");
  }
}

// Gets all the products categories.
export async function getAllCategories() {
  try {
    const { data } = await supabase.from("Products").select("categories");
    const categories = data.flatMap((categorie) => categorie.categories);
    return [...new Set(categories)];
  } catch (error) {
    showToast("Se produjó un error inesperado", "error");
  }
}

// Gets all the published products categories.
export async function getAllPublishedCategories() {
  try {
    const { data } = await supabase.from("Products").select("categories").eq("isPublished", true);
    const categories = data.flatMap((categorie) => categorie.categories);
    return [...new Set(categories)];
  } catch (error) {
    showToast("Se produjó un error inesperado", "error");
  }
}

// Gets all the products editorials.
export async function getAllEditorials() {
  try {
    const { data } = await supabase.from("Products").select("editorial").neq("editorial", null);
    const editorials = data.flatMap((editorial) => editorial.editorial);
    return [...new Set(editorials)];
  } catch (error) {
    showToast("Se produjó un error inesperado", "error");
  }
}

// Gets all the editorial sizes.
export async function getEditorialSizes(editorial) {
  try {
    const { data } = await supabase.from("Products").select("size").eq("editorial", editorial).neq("size", null);
    const editorialSizes = data.flatMap((size) => size.size);
    return [...new Set(editorialSizes)];
  } catch (error) {
    showToast("Se produjó un error inesperado", "error");
  }
}

// Gets all the prices according to the editorial and size.
export async function getEditorialSizePrice(editorial, size) {
  try {
    const { data } = await supabase.from("Products").select("price").eq("editorial", editorial).eq("size", size);
    const prices = data.flatMap((price) => price.price);
    return [...new Set(prices)];
  } catch (error) {
    showToast("Se produjó un error inesperado", "error");
  }
}

// SET functions

// Sets the new price of all the products that matches the editorial, size and oldPrice.
export async function changePrice(editorial, size, oldPrice, newPrice) {
  try {
    await supabase.from("Products").update({ price: newPrice }).eq("editorial", editorial).eq("size", size).eq("price", oldPrice);
    showToast("Se actualizó correctamente los precios", "success");
  } catch (error) {
    showToast("Error al actualizar los precios", "error");
  }
}

// Sets the product as a novelty.
export async function setAsNovelty(id, value) {
  try {
    await supabase.from("Products").update({ isNovelty: value }).eq("id", id);
    if (value) showToast("Producto establecido como novedad", "success");
    else showToast("Producto quitado de novedades", "success");
  } catch (error) {
    showToast("Error al establecer producto como novedad", "error");
  }
}

// Sets the product as a presale..
export async function setAsPresale(id, value) {
  try {
    await supabase.from("Products").update({ isPresale: value }).eq("id", id);
    if (value) showToast("Producto establecido como preventa", "success");
    else showToast("Producto quitado de preventas", "success");
  } catch (error) {
    showToast("Error al establecer producto como preventa", "error");
  }
}

// Sets the product as published.
export async function handlePublish(id, value) {
  try {
    await supabase.from("Products").update({ isPublished: value }).eq("id", id);
    if (value) showToast("Producto establecido como público", "success");
    else showToast("Producto establecido como privado", "success");
  } catch (error) {
    showToast("Error al establecer producto como público", "error");
  }
}

// Creates a new product
export async function createProduct(
  type,
  name,
  image,
  imageSmall,
  size,
  author,
  editorial,
  categories,
  price,
  discount,
  stock,
  description
) {
  try {
    await supabase
      .from("Products")
      .insert([{ type, name, image, imageSmall, size, author, editorial, categories, price, discount, stock, description }]);
    showToast("Se agregó correctamente el producto", "success");
    router.push({ name: "Stock" });
  } catch (error) {
    showToast("Error al agregar el producto", "error");
  }
}

// Deletes a product.
export async function deleteProduct(id) {
  try {
    await supabase.from("Products").delete().eq("id", id);
    showToast("Se eliminó correctamente el producto", "success");
  } catch (error) {
    showToast("Error al eliminar el producto", "error");
  }
}

// Updates a product
export async function updateProduct(
  id,
  type,
  name,
  image,
  imageSmall,
  size,
  author,
  editorial,
  categories,
  price,
  discount,
  stock,
  description
) {
  try {
    await supabase
      .from("Products")
      .update({
        type: type,
        name: name,
        image: image,
        imageSmall: imageSmall,
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
    router.push({ name: "Stock" });
  } catch (error) {
    showToast("Error al editar el producto", "error");
  }
}

// --------------- File functions ---------------
// SET funcions
// Uploads a file to the bucket.
export async function uploadFile(author, name, file) {
  const time = new Date().getTime();
  try {
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(`${author.toLowerCase()}/${name.toLowerCase()}-${time}`, file, {
        cacheControl: "31536000",
        upsert: false,
      });
    if (uploadError) throw new Error("Error al cargar la imágen");

    const { data, error: urlError } = supabase.storage
      .from("products")
      .getPublicUrl(`${author.toLowerCase()}/${name.toLowerCase()}-${time}`);
    if (urlError) throw new Error("Error al obtener el URL de la imágen");
    else return data.publicUrl;
  } catch (error) {
    showToast(error.message, "error");
  }
}

// Deletes a file from the bucket.
export async function deleteFile(image) {
  try {
    await supabase.storage.from("products").remove([image]);
    showToast("Se eliminó correctamente la imágen", "success");
  } catch (error) {
    showToast("Error al borrar la imágen", "error");
  }
}

// --------------- Order functions ---------------
// GET functions

// Gets all the orders.
export async function getAllOrders(offset, limit, filter) {
  try {
    const { orderId, state, order, asc } = filter.value;
    let query = supabase.from("Orders").select("*", { count: "exact" }).range(offset, limit);

    if (orderId) query = query.ilike("id", `%${orderId}%`);
    if (state && state !== "all") query = query.eq("status", state);
    if (order === "surname") query = query.order("payer->surname", { ascending: asc });
    else if (order) query = query.order(order, { ascending: asc });

    const { data, count } = await query;
    return { data, count };
  } catch (error) {
    console.log(error);
  }
}

// SET functions
export async function updateOrderShipment(id, state) {
  try {
    await supabase.from("Orders").update({ updated_shipment: state }).eq("id", id);
    showToast("Se actualizó correctamente el estado del envío", "success");
  } catch (error) {
    showToast("Error al actualizar el estado del envío", "error");
  }
}
