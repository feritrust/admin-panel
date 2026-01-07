import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
console.log("📡 baseURL:", baseURL);

export const loginAdmin = (email, password) =>
  axios.post(
    `${baseURL}/admin/login`,
    { email, password },
    { withCredentials: true }
  );

export const logoutAdmin = () =>
  axios.post(`${baseURL}/admin/logout`, {}, { withCredentials: true });

export const fetchAdminMe = async () => {
  const url = `${baseURL}/admin/me`;
  console.log("📡 calling fetchAdminMe to:", url);
  try {
    const res = await axios.get(url, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("❌ fetchAdminMe failed:", err?.response?.status);
    throw err;
  }
};

export const fetchAllUsers = () =>
  axios
    .get(`${baseURL}/admin/users`, { withCredentials: true })
    .then((res) => res.data);


export const fetchAdminUsers = async ({ page = 1, search = "", gender = "", country = "", city = "" }) => {
  const params = new URLSearchParams();
  params.append('page', page);
  if (search) params.append('search', search);
  if (gender) params.append('gender', gender);
  if (country) params.append('country', country);
  if (city) params.append('city', city);

  const res = await axios.get(`${baseURL}/admin/users?${params.toString()}`, { withCredentials: true });
  return res.data;
};

export const fetchUserDetails = async (telegramId) => {
  const url = `${baseURL}/admin/users/${encodeURIComponent(telegramId)}/details`;
  const res = await axios.get(url, { withCredentials: true });
  return res.data;
};

export const addCoins = (telegramId, amount) => {
  return axios
    .post(`${baseURL}/admin/users/${telegramId}/add-coins`, { amount }, { withCredentials: true })
    .then(res => res.data);
};

// api/admin.js
// ✅ مسیر درست مطابق با @Get('user/:telegramId/chats') در کنترلر NestJS
export const fetchUserChats = (telegramId) => {
  return axios.get(`${baseURL}/admin/users/${telegramId}/chats`, { withCredentials: true });
};

export const fetchMessagesBetween = async (user1, user2) => {
  const url = `${baseURL}/messages/admin/between?user1=${user1}&user2=${user2}`;
  const res = await axios.get(url, { withCredentials: true });
  return res.data;
};

// Daily visits
export const fetchDailyVisits = () =>
  axios.get(`${baseURL}/admin/stats/daily-visits`, { withCredentials: true })
    .then(res => res.data);

// Total users
export const fetchTotalUsers = () =>
  axios.get(`${baseURL}/admin/stats/total-users`, { withCredentials: true })
    .then(res => res.data);

// Users by country
export const fetchUsersByCountry = () =>
  axios.get(`${baseURL}/admin/stats/users-by-country`, { withCredentials: true })
    .then(res => res.data);

// Daily signups
export const fetchDailySignups = () =>
  axios.get(`${baseURL}/admin/stats/daily-signups`, { withCredentials: true })
    .then(res => res.data);

// Gender breakdown
export const fetchGenderStats = () =>
  axios.get(`${baseURL}/admin/stats/gender-breakdown`, { withCredentials: true })
    .then(res => res.data);

 export const fetchAdminStats = async () => {
  const res = await axios.get(`${baseURL}/admin/stats/summary`, { withCredentials: true });
  return res.data;
};

export async function sendBroadcast(text) {
  const res = await fetch(`${baseURL}/bot/broadcast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to send broadcast');
  return await res.json();
}

export async function addLoyalty(telegramId, amount) {
  console.log("📡 addLoyalty →", { telegramId, amount });
  const res = await axios.post(
    `${baseURL}/admin/users/${encodeURIComponent(telegramId)}/loyalty/add`,
    { amount: Number(amount) },
    { withCredentials: true }
  );
  return res.data; // { message, loyaltyPoints }
}

export async function setLoyalty(telegramId, value) {
  console.log("📡 setLoyalty →", { telegramId, value });
  const res = await axios.post(
    `${baseURL}/admin/users/${encodeURIComponent(telegramId)}/loyalty/set`,
    { value: Number(value) },
    { withCredentials: true }
  );
  return res.data; // { message, loyaltyPoints }
}
