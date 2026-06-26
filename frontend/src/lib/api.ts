const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function getToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 && typeof document !== 'undefined') {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    localStorage.removeItem('jogga_user');
    window.location.href = '/auth/login';
    throw new Error('Session expirée');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body?.message || `Erreur ${res.status}`;
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(path: string, data: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(data) }),
  patch: <T>(path: string, data: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

// ─── Types Store ──────────────────────────────────────────────────────────────

export type ApiUser = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'CUSTOMER' | 'ADMIN' | 'DELIVERY';
  avatarUrl: string | null;
  birthDate: string | null;
  createdAt: string;
};

export type ApiAddress = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  isDefault: boolean;
  createdAt: string;
};

export type ApiReview = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { fullName: string; avatarUrl: string | null };
};

export type ApiWishlistItem = {
  id: string;
  addedAt: string;
  product: ApiProduct & { imageUrl: string | null };
};

export type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  parentId: string | null;
  _count?: { products: number };
};

export type ApiProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  imageUrl: string | null;
  imageUrls: string[];
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
  category?: ApiCategory;
};

export type ApiCartItem = {
  id: string;
  quantity: number;
  product: ApiProduct;
};

export type ApiCart = {
  id: string;
  items: ApiCartItem[];
};

export type ApiOrderStatus = {
  status: string;
  note: string | null;
  createdAt: string;
};

export type ApiOrder = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  paymentMode: string;
  createdAt: string;
  items: { quantity: number; unitPrice: number; product: ApiProduct }[];
  statuses: ApiOrderStatus[];
  user?: { id: string; fullName: string; phone: string };
};

// ─── Stats admin ──────────────────────────────────────────────────────────────

export type AdminStats = {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCategories: number;
  recentOrders: ApiOrder[];
};
