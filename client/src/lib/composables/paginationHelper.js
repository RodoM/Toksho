import { ref } from "vue";
import { getAllProducts, getAllProductsAdmin } from "@/supabase/helpers.js";

const useProductPagination = (isAdmin) => {
  // Fetching products
  const products = ref();
  const count = ref(0);

  const filter = ref({
    name: undefined,
    type: undefined,
    author: undefined,
    categorie: undefined,
    order: "created_at",
    asc: true,
  });

  const loading = ref(false);

  const resetPaginationValues = () => {
    pagination.value.currentPage = 1;
    pagination.value.limitPages = 5;
    pagination.value.offsetPages = 0;
    pagination.value.limit = pagination.value.productsPerPage;
    pagination.value.offset = 0;
  };

  const fetchProducts = async (name, type, author, categorie, order, asc) => {
    if (name != filter.value.name) {
      filter.value.name = name;
      resetPaginationValues();
    }
    if (type) filter.value.type = type;
    if (author) filter.value.author = author;
    if (categorie) filter.value.categorie = categorie;
    if (order) filter.value.order = order;
    if (asc) filter.value.asc = asc;

    loading.value = true;

    const fetchFunction = isAdmin ? getAllProductsAdmin : getAllProducts;

    const res = await fetchFunction(
      pagination.value.offset,
      pagination.value.limit,
      filter
    );

    products.value = res.data;
    count.value = res.count;
    pages(count.value);

    loading.value = false;
  };

  const clearFilters = async () => {
    filter.value.type = undefined;
    filter.value.author = undefined;
    filter.value.categorie = undefined;
    filter.value.order = "created_at";
    filter.value.asc = true;
    await fetchProducts(filter.value.name);
  };

  // Pagination
  const pagination = ref({
    productsPerPage: 35,
    currentPage: 1,
    limitPages: 5,
    offsetPages: 0,
    offset: 0,
    limit: 35,
  });

  const pages = () => {
    const { productsPerPage, currentPage, limitPages, offsetPages } =
      pagination.value;
    const totalPages = Math.ceil(count.value / productsPerPage);
    if (totalPages < 5) {
      pagination.value.limitPages = totalPages;
    } else if (currentPage === limitPages) {
      if (limitPages + 2 < totalPages) {
        pagination.value.limitPages += 2;
        pagination.value.offsetPages += 2;
      } else if (limitPages + 1 < totalPages) {
        pagination.value.limitPages += 1;
        pagination.value.offsetPages += 1;
      }
    } else if (currentPage === offsetPages + 1 && currentPage !== 1) {
      if (limitPages - 2 > 0) {
        pagination.value.limitPages -= 2;
        pagination.value.offsetPages -= 2;
      } else if (limitPages - 1 > 0) {
        pagination.value.limitPages -= 1;
        pagination.value.offsetPages -= 1;
      }
    }
  };

  const prevPage = () => {
    const { offset, productsPerPage } = pagination.value;
    pagination.value.limit = offset - 1;
    if (offset - productsPerPage > 0) {
      pagination.value.offset -= productsPerPage + 1;
    } else {
      pagination.value.offset = 0;
    }
    pagination.value.currentPage -= 1;
    fetchProducts(filter.value.name);
  };

  const nextPage = () => {
    const { limit, productsPerPage } = pagination.value;
    pagination.value.offset = limit + 1;
    if (pagination.value.limit + productsPerPage < count.value) {
      pagination.value.limit += productsPerPage + 1;
    } else {
      pagination.value.limit = count.value;
    }
    pagination.value.currentPage += 1;
    fetchProducts(filter.value.name);
  };

  const goToPage = (page) => {
    const { productsPerPage } = pagination.value;
    if (page == 1) {
      pagination.value.limit = productsPerPage;
      pagination.value.offset = 0;
    } else {
      pagination.value.offset = (productsPerPage + 1) * (page - 1);
      if (productsPerPage * (page - 1) > count.value) {
        pagination.value.limit = count.value;
      } else {
        pagination.value.limit =
          productsPerPage + (productsPerPage + 1) * (page - 1);
      }
    }
    pagination.value.currentPage = page;
    fetchProducts(filter.value.name);
  };

  return {
    loading,
    productsData: { products, count },
    productsFunctions: { fetchProducts, clearFilters },
    pagination,
    pagesFunctions: { prevPage, nextPage, goToPage },
  };
};

export default useProductPagination;
