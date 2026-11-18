// Real backend API. Used when VITE_API_URL is set.
// Each endpoint should return the JSON shape described in README.md ("API contract").
// If your backend uses different field names (for example plate_number), convert them
// here and leave the rest of the app untouched.
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
let token = null;

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let message = 'Something went wrong. Please try again.';
    try {
      const data = await res.json();
      message = data.message || data.error || message;
    } catch { /* response had no JSON body */ }
    throw new Error(message);
  }
  return res.status === 204 ? null : res.json();
}

export default {
  setToken(t) { token = t; },

  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }), // -> { token, user }
  register: (data) => request('/auth/register', { method: 'POST', body: data }),         // -> { token, user }
  updateMe: (patch) => request('/me', { method: 'PUT', body: patch }),                    // -> user

  getVehicle: () => request('/vehicle'),                                                  // -> vehicle | null
  saveVehicle: (data) => request('/vehicle', { method: 'PUT', body: data }),              // -> vehicle
  getHealth: () => request('/vehicle/health'),                                            // -> { score }

  listAppointments: () => request('/appointments'),                                       // -> appointment[]
  createAppointment: (data) => request('/appointments', { method: 'POST', body: data }),  // -> appointment

  listServiceRecords: () => request('/service-records'),                                  // -> record[]

  getStaffDashboard: () => request('/staff/dashboard'),                                   // staff only, see README

  listNotifications: () => request('/notifications'),                                     // -> notification[]
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
};
