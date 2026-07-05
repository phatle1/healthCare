// Hardcoded reference data for the demo.
const DOCTORS = [
  { id: "d1", name: "Dr. Sarah Johnson", specialty: "Cardiology", availability: "Mon, Wed, Fri" },
  { id: "d2", name: "Dr. Michael Chen", specialty: "Dermatology", availability: "Tue, Thu" },
  { id: "d3", name: "Dr. Emily Rodriguez", specialty: "Pediatrics", availability: "Mon - Fri" },
  { id: "d4", name: "Dr. James Wilson", specialty: "Orthopedics", availability: "Wed, Thu, Fri" },
  { id: "d5", name: "Dr. Aisha Patel", specialty: "General Medicine", availability: "Mon - Sat" },
];

// Seed appointments used only the first time the app runs (before localStorage exists).
const SEED_APPOINTMENTS = [
  { id: "a1", patient: "John Smith", doctorId: "d1", date: "2026-07-08", time: "09:30", reason: "Routine checkup", status: "Upcoming" },
  { id: "a2", patient: "Maria Garcia", doctorId: "d2", date: "2026-07-05", time: "14:00", reason: "Skin rash", status: "Upcoming" },
  { id: "a3", patient: "David Lee", doctorId: "d3", date: "2026-06-20", time: "11:00", reason: "Vaccination", status: "Completed" },
  { id: "a4", patient: "Linda Brown", doctorId: "d4", date: "2026-06-15", time: "10:15", reason: "Knee pain", status: "Cancelled" },
  { id: "a5", patient: "Robert Taylor", doctorId: "d5", date: "2026-07-10", time: "16:45", reason: "Annual physical", status: "Upcoming" },
];
