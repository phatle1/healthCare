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

/**
 * Converts an array of objects into a CSV formatted string.
 * @param {Array<Object>} dataArray - The array of objects to convert.
 * @returns {string} The CSV formatted string.
 */
const convertToCsv = (dataArray) => {
  if (!dataArray || dataArray.length === 0) return "";

  // Get headers from the keys of the first object
  const headers = Object.keys(dataArray[0]);
  const csvHeaders = headers.map(header => `"${header}"`).join(',');

  // Convert each object to a CSV row
  const csvRows = dataArray.map(obj => {
    const values = headers.map(header => {
      let value = obj[header];
      // Handle potential commas or quotes within the data field itself
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        // Escape quotes by doubling them and wrap the whole field in quotes
        value = `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    return values.join(',');
  });

  // Combine headers and rows
  return [csvHeaders, ...csvRows].join('\n');
};

// --- Examples of usage ---

// 1. Exporting DOCTORS data
const doctorsCsv = convertToCsv(DOCTORS);
console.log("--- DOCTORS CSV ---");
console.log(doctorsCsv);

// 2. Exporting SEED_APPOINTMENTS data
const appointmentsCsv = convertToCsv(SEED_APPOINTMENTS);
console.log("\n--- APPOINTMENTS CSV ---");
console.log(appointmentsCsv);