// fetches/products.js
import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts() {
  const res = await axios.get(`${API_URL}/shop/products`, { withCredentials: true });
  return res.data;
}

export async function createProduct(payload) {
  const res = await axios.post(`${API_URL}/admin/products`, payload, { withCredentials: true });
  return res.data;
}

export async function updateProduct(id, payload) {
  const res = await axios.put(`${API_URL}/admin/products/${id}`, payload, { withCredentials: true });
  return res.data;
}

export async function deleteProduct(id) {
  const res = await axios.delete(`${API_URL}/admin/products/${id}`, { withCredentials: true });
  return res.data;
}

export async function uploadProductImage(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await axios.post(`${API_URL}/admin/products/upload-image`, fd, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}
