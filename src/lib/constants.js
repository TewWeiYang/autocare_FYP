// Service types shown on the Book Appointment screen.
export const SERVICE_TYPES = [
  { id: 'general', label: 'General Service', icon: 'wrench' },
  { id: 'repair', label: 'Repair Service', icon: 'car' },
  { id: 'tyre', label: 'Tyre Change', icon: 'tyre' },
  { id: 'other', label: 'Other Services', icon: 'dots' },
];

export const serviceLabel = (id) => SERVICE_TYPES.find((s) => s.id === id)?.label ?? id;

export const TIME_SLOTS = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];

export const OWNERSHIP_OPTIONS = ['Sole owner', 'Joint owner', 'Company vehicle', 'Leased'];

export const SUPPORT_EMAIL = 'support@autocare.example';

// Roles that see the staff area instead of the customer app.
// 'staff' is included because the electric_vehicle_db sample data uses it.
export const STAFF_ROLES = ['staff', 'advisor', 'technician', 'manager', 'admin'];
export const isStaff = (role) => STAFF_ROLES.includes(role);
