export async function apiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""

  const response = await fetch(`${baseUrl}/api${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "API call failed")
  }

  return response.json()
}

export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    apiCall("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { email: string; password: string; role?: string }) =>
    apiCall("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  logout: () => apiCall("/auth/logout", { method: "POST" }),

  getCurrentUser: () => apiCall("/auth/me"),
}

export const packagesAPI = {
  getAll: () => apiCall("/packages"),

  getById: (id: string) => apiCall(`/packages/${id}`),

  create: (data: any) => apiCall("/packages", { method: "POST", body: JSON.stringify(data) }),

  update: (id: string, data: any) => apiCall(`/packages/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: string) => apiCall(`/packages/${id}`, { method: "DELETE" }),
}

export const bookingsAPI = {
  getAll: () => apiCall("/bookings"),

  create: (data: any) => apiCall("/bookings", { method: "POST", body: JSON.stringify(data) }),
}
