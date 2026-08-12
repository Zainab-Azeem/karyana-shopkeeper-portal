import api from "./ClientApi";

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const searchProducts = async (query) => {
  const response = await api.get("/products/search", {
    params: { q: query },
  });

  return response.data;
};

export const filterProducts = async (categoryId, status) => {
  const response = await api.get("/products/filter", {
    params: {
      category_id: categoryId || undefined,
      status: status || undefined,
    },
  });

  return response.data;
};

export const addProduct = async (data) => {
  const response = await api.post("/products", data);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};