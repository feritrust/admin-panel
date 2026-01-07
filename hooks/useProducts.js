// hooks/useProducts.js
import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, uploadProductImage } from '@/fetches/products';
import { toast } from 'sonner';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch {
      toast.error('❌ خطا در دریافت لیست محصولات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleCreate = async (payload) => {
    try {
      await createProduct(payload);
      toast.success('✅ محصول اضافه شد');
      fetchProducts();
    } catch {
      toast.error('❌ خطا در ذخیره محصول');
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      await updateProduct(id, payload);
      toast.success('✅ محصول ویرایش شد');
      fetchProducts();
    } catch {
      toast.error('❌ خطا در ویرایش محصول');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('آیا مطمئنی؟')) return;
    try {
      await deleteProduct(id);
      toast.success('✅ محصول حذف شد');
      fetchProducts();
    } catch {
      toast.error('❌ خطا در حذف محصول');
    }
  };

  const handleUploadImage = async (file) => {
    try {
      const res = await uploadProductImage(file);
      toast.success('✅ عکس آپلود شد');
      return res.url;
    } catch {
      toast.error('❌ خطا در آپلود عکس');
      return null;
    }
  };

  return {
    products,
    loading,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleUploadImage,
  };
}
