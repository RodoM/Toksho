import { ref } from "vue";
import { getAllOrders } from "@/supabase/helpers.js";

const useOrderPagination = () => {
  // Fetching orders
  const orders = ref();
  const count = ref(0);

  const filter = ref({
    orderId: undefined,
    state: "all",
    order: "date_created",
    asc: false,
  });

  const loading = ref(false);

  const resetPaginationValues = () => {
    pagination.value.currentPage = 1;
    pagination.value.limitPages = 5;
    pagination.value.offsetPages = 0;
    pagination.value.limit = pagination.value.ordersPerPage;
    pagination.value.offset = 0;
  };

  const fetchOrders = async (orderId, state, order, asc = false) => {
    if (orderId != filter.value.orderId) {
      filter.value.orderId = orderId;
      resetPaginationValues();
    }
    if (state) filter.value.state = state;
    if (order) filter.value.order = order;
    filter.value.asc = asc;

    loading.value = true;

    const res = await getAllOrders(
      pagination.value.offset,
      pagination.value.limit,
      filter
    );

    orders.value = res.data;
    count.value = res.count;
    pages(count.value);

    loading.value = false;
  };

  const clearFilters = async () => {
    filter.value.state = "all";
    filter.value.order = "date_created";
    filter.value.asc = false;
    await fetchOrders(filter.value.orderId);
  };

  // Pagination
  const pagination = ref({
    ordersPerPage: 20,
    currentPage: 1,
    limitPages: 5,
    offsetPages: 0,
    offset: 0,
    limit: 20,
  });

  const pages = () => {
    const { ordersPerPage, currentPage, limitPages, offsetPages } =
      pagination.value;
    const totalPages = Math.ceil(count.value / ordersPerPage);
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
    const { offset, ordersPerPage } = pagination.value;
    pagination.value.limit = offset - 1;
    if (offset - ordersPerPage > 0) {
      pagination.value.offset -= ordersPerPage + 1;
    } else {
      pagination.value.offset = 0;
    }
    pagination.value.currentPage -= 1;
    fetchOrders(filter.value.orderId);
  };

  const nextPage = () => {
    const { limit, ordersPerPage } = pagination.value;
    pagination.value.offset = limit + 1;
    if (pagination.value.limit + ordersPerPage < count.value) {
      pagination.value.limit += ordersPerPage + 1;
    } else {
      pagination.value.limit = count.value;
    }
    pagination.value.currentPage += 1;
    fetchOrders(filter.value.orderId);
  };

  const goToPage = (page) => {
    const { ordersPerPage } = pagination.value;
    if (page == 1) {
      pagination.value.limit = ordersPerPage;
      pagination.value.offset = 0;
    } else {
      pagination.value.offset = (ordersPerPage + 1) * (page - 1);
      if (ordersPerPage * (page - 1) > count.value) {
        pagination.value.limit = count.value;
      } else {
        pagination.value.limit =
          ordersPerPage + (ordersPerPage + 1) * (page - 1);
      }
    }
    pagination.value.currentPage = page;
    fetchOrders(filter.value.orderId);
  };

  return {
    loading,
    ordersData: { orders, count },
    ordersFunctions: { fetchOrders, clearFilters },
    pagination,
    pagesFunctions: { prevPage, nextPage, goToPage },
  };
};

export default useOrderPagination;
