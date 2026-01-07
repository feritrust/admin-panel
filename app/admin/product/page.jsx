'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { toast } from 'sonner';

const API = process.env.NEXT_PUBLIC_API_URL || '';

function resolveImg(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API}${url}`;
}

export default function CreateProductPage() {
  const { products, handleCreate, handleUpdate, handleDelete, handleUploadImage } = useProducts();

  const [form, setForm] = useState({
    id: null,
    name: '',
    type: 'title',       // 'title' | 'coin' | 'special'
    starsPrice: '',
    loyaltyPrice: '',    // فقط برای TITLE (اختیاری)
    profileTitle: '',    // فقط برای TITLE
    netWorthBoost: '',
    coins: '',           // فقط برای COIN
    stock: '',           // فقط برای TITLE (خالی = نامحدود)
    imageUrl: '',
    description: '',
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onTypeChange = (e) => {
    const val = e.target.value; // 'title' | 'coin' | 'special'
    setForm((p) => {
      const next = { ...p, type: val };
      // وقتی نوع عوض می‌شود، فیلدهای غیرمرتبط را تمیز نگه داریم
      if (val === 'title') {
        next.coins = '';
        // استاک خالی = نامحدود
        // profileTitle / loyaltyPrice فعال می‌مانند
      } else if (val === 'coin') {
        next.coins = p.coins || '';        // نیاز است، خالی هم بماند تا کاربر پر کند
        next.stock = '';                    // کوین استاک ندارد
        next.profileTitle = '';
        next.loyaltyPrice = '';
      } else {
        // special
        next.coins = '';
        next.stock = '';
        next.profileTitle = '';
        next.loyaltyPrice = '';
      }
      return next;
    });
  };

  const onImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await handleUploadImage(file);
    if (url) setForm((p) => ({ ...p, imageUrl: url }));
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: '',
      type: 'title',
      starsPrice: '',
      loyaltyPrice: '',
      profileTitle: '',
      netWorthBoost: '',
      coins: '',
      stock: '',
      imageUrl: '',
      description: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const upperType = (form.type || '').toUpperCase(); // TITLE | COIN | SPECIAL
    const priceStars = Number(form.starsPrice) || 0;
    const netWorth = Number(form.netWorthBoost) || 0;

    const payload = {
      name: (form.name || '').trim(),
      type: upperType,
      priceStars,
      netWorth,
      imageUrl: form.imageUrl || null,
      description: form.description || null,
    };

    if (upperType === 'TITLE') {
      // تایتل: پروفایل‌تایتل و قیمت LP اختیاری
      const lp = Number(form.loyaltyPrice) || 0;
      payload.profileTitle = (form.profileTitle || '').trim() || null;
      payload.priceLoyalty = lp > 0 ? lp : null;

      // استاک: خالی = نامحدود (null)، در غیر این صورت عدد >= 0
      const stockStr = String(form.stock ?? '').trim();
      if (stockStr === '') {
        payload.stock = null; // Unlimited
      } else {
        const s = Number(stockStr);
        if (!Number.isFinite(s) || s < 0) {
          toast.error('Stock باید عدد غیرمنفی باشد.');
          return;
        }
        payload.stock = s;
      }

      payload.coins = 0; // تایتل کوین ندارد

    } else if (upperType === 'COIN') {
      const c = Number(form.coins) || 0;
      if (c <= 0) {
        toast.error('برای Coin باید مقدار coins > 0 وارد شود.');
        return;
      }
      payload.coins = c;
      payload.stock = null;        // کوین استاک ندارد
      payload.profileTitle = null; // فقط برای تایتل
      payload.priceLoyalty = null; // فقط برای تایتل

    } else {
      // SPECIAL
      payload.coins = 0;
      payload.stock = null;
      payload.profileTitle = null;
      payload.priceLoyalty = null;
    }

    if (form.id) {
      handleUpdate(form.id, payload);
    } else {
      handleCreate(payload);
    }
    resetForm();
  };

  const handleEdit = (p) => {
    const typeLower = (p.type || '').toLowerCase();
    const isTitle = typeLower === 'title';
    setForm({
      id: p.id,
      name: p.name || '',
      type: typeLower || 'title',
      starsPrice: String(p.priceStars ?? ''),
      loyaltyPrice: String(p.priceLoyalty ?? ''),    // فقط نمایش برای تایتل
      profileTitle: String(p.profileTitle ?? ''),    // فقط نمایش برای تایتل
      netWorthBoost: String(p.netWorth ?? ''),
      coins: String(p.coins ?? ''),                  // فقط اگر coin باشد استفاده می‌شود
      stock: p.stock == null ? '' : String(p.stock), // خالی = نامحدود
      imageUrl: p.imageUrl || '',
      description: p.description || '',
    });
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 border rounded-2xl shadow">
      <h1 className="text-xl font-bold mb-4">{form.id ? 'Edit product' : 'Create product'}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          placeholder="Name (Shop title)"
          value={form.name}
          onChange={onChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={onChange}
          className="w-full border rounded p-2"
        />

        <input type="file" accept="image/*" onChange={onImage} />
        {form.imageUrl && (
          <img src={resolveImg(form.imageUrl)} alt="" className="h-20 rounded object-cover mt-2" />
        )}

        <select name="type" value={form.type} onChange={onTypeChange} className="w-full p-2 border rounded">
          <option value="title">Title</option>
          <option value="coin">Coin</option>
          <option value="special">Special</option>
        </select>

        <Input
          type="number"
          name="starsPrice"
          placeholder="Stars price"
          value={form.starsPrice}
          onChange={onChange}
          required
        />

        <Input
          type="number"
          name="netWorthBoost"
          placeholder="Net worth boost"
          value={form.netWorthBoost}
          onChange={onChange}
        />

        {form.type === 'coin' && (
          <Input
            type="number"
            name="coins"
            placeholder="Coins to grant"
            value={form.coins}
            onChange={onChange}
            required
          />
        )}

        {form.type === 'title' && (
          <>
            <Input
              name="profileTitle"
              placeholder='Profile Title (e.g. "Boss", "Elite", "Rich Kid", "Charismatic")'
              value={form.profileTitle}
              onChange={onChange}
            />

            <Input
              type="number"
              name="loyaltyPrice"
              placeholder="Loyalty price (optional, for Charismatic)"
              value={form.loyaltyPrice}
              onChange={onChange}
            />

            <Input
              type="number"
              name="stock"
              placeholder="Stock (leave blank = Unlimited)"
              value={form.stock}
              onChange={onChange}
              min={0}
            />
          </>
        )}

        <div className="flex gap-2">
          <Button type="submit" className="w-full">
            {form.id ? 'Save' : 'Create'}
          </Button>
          {form.id && (
            <Button type="button" variant="secondary" className="w-full" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <hr className="my-6" />

      <h2 className="text-lg font-bold mb-2">Products</h2>
      <ul className="space-y-2">
        {products.map((p) => {
          const isTitle = String(p.type).toUpperCase() === 'TITLE';
          const hasLP = (p.priceLoyalty ?? 0) > 0;
          const stockText = isTitle ? (p.stock == null ? '∞' : String(p.stock)) : '—';
          return (
            <li key={p.id} className="p-3 border rounded flex justify-between items-center">
              <div className="flex items-center gap-3">
                {p.imageUrl && (
                  <img src={resolveImg(p.imageUrl)} alt="" className="h-10 w-10 rounded object-cover" />
                )}
                <div>
                  <p className="font-medium">
                    {p.name}
                    {isTitle && p.profileTitle ? (
                      <span className="text-xs text-zinc-500"> — profile: {p.profileTitle}</span>
                    ) : null}
                  </p>
                  <p className="text-sm text-gray-600">
                    {p.type} • ⭐ {p.priceStars}
                    {hasLP && <span> + 💎 {p.priceLoyalty}</span>}
                    {isTitle && <span> • stock: {stockText}</span>}
                  </p>
                  {String(p.type).toUpperCase() === 'COIN' && (
                    <p className="text-xs text-blue-500">includes {p.coins} coins</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleEdit(p)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>Delete</Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
