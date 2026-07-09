(function () {
  const SESSION_KEY = "medicare_session";
  const STORAGE_KEY = "medicare_appointments";

  document.getElementById("logoutBtn").addEventListener("click", function () {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem("medicare_username");
    window.location.href = "index.html";
  });

  const loggedInUser = sessionStorage.getItem("medicare_username") || "admin";
  document.getElementById("welcomeMsg").textContent = "Welcome, " + loggedInUser;

  function loadAppointments() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_APPOINTMENTS));
    return SEED_APPOINTMENTS.slice();
  }

  function saveAppointments(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function doctorById(id) {
    return DOCTORS.find(function (d) { return d.id === id; });
  }

  let appointments = loadAppointments();
  let sortState = {
    key: "date",
    direction: "desc",
  };

  // ---------- Feature: Stats overview ----------
  function renderStats() {
    document.getElementById("statTotal").textContent = appointments.length;
    document.getElementById("statUpcoming").textContent =
      appointments.filter(function (a) { return a.status === "Upcoming"; }).length;
    document.getElementById("statCompleted").textContent =
      appointments.filter(function (a) { return a.status === "Completed"; }).length;
    document.getElementById("statCancelled").textContent =
      appointments.filter(function (a) { return a.status === "Cancelled"; }).length;
  }

  // ---------- Feature: Doctor directory ----------
  function renderDoctors() {
    const container = document.getElementById("doctorList");
    container.innerHTML = DOCTORS.map(function (doc) {
      const initials = doc.name.replace("Dr. ", "").split(" ").map(function (n) { return n[0]; }).join("");
      return (
        '<div class="doctor-card">' +
          '<div class="doctor-avatar">' + initials + "</div>" +
          '<div class="doctor-info">' +
            '<div class="doctor-name">' + doc.name + "</div>" +
            '<div class="doctor-specialty">' + doc.specialty + "</div>" +
            '<div class="doctor-availability">Available: ' + doc.availability + "</div>" +
          "</div>" +
        "</div>"
      );
    }).join("");
  }

  function populateDoctorSelect() {
    const select = document.getElementById("doctorSelect");
    select.innerHTML = DOCTORS.map(function (doc) {
      return '<option value="' + doc.id + '">' + doc.name + " - " + doc.specialty + "</option>";
    }).join("");
  }

  // ---------- Feature: Book appointment ----------
  document.getElementById("bookForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const patient = document.getElementById("patientName").value.trim();
    const doctorId = document.getElementById("doctorSelect").value;
    const date = document.getElementById("apptDate").value;
    const time = document.getElementById("apptTime").value;
    const reason = document.getElementById("apptReason").value.trim();

    if (!patient || !doctorId || !date || !time) return;

    appointments.unshift({
      id: "a" + Date.now(),
      patient: patient,
      doctorId: doctorId,
      date: date,
      time: time,
      reason: reason || "General consultation",
      status: "Upcoming",
    });

    saveAppointments(appointments);
    renderAll();

    e.target.reset();
    const successMsg = document.getElementById("bookSuccess");
    successMsg.hidden = false;
    setTimeout(function () { successMsg.hidden = true; }, 2500);
  });

  // ---------- Feature: Appointment list with search/filter/cancel ----------
  function getSortValue(appt, key) {
    const doc = doctorById(appt.doctorId) || { name: "Unknown", specialty: "-" };
    const values = {
      patient: appt.patient,
      doctor: doc.name,
      specialty: doc.specialty,
      date: appt.date,
      time: appt.time,
      status: appt.status,
    };

    return values[key] || "";
  }

  function updateSortHeaders() {
    document.querySelectorAll(".sort-header").forEach(function (button) {
      const isActive = button.getAttribute("data-sort-key") === sortState.key;
      const indicator = button.querySelector(".sort-indicator");
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-sort", isActive ? (sortState.direction === "asc" ? "ascending" : "descending") : "none");
      indicator.textContent = isActive ? (sortState.direction === "asc" ? "▲" : "▼") : "";
    });
  }

  function renderTable() {
    const searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();
    const statusFilter = document.getElementById("filterStatus").value;

    const rows = appointments
      .filter(function (appt) {
        const doc = doctorById(appt.doctorId);
        const matchesSearch =
          !searchTerm ||
          appt.patient.toLowerCase().includes(searchTerm) ||
          (doc && doc.name.toLowerCase().includes(searchTerm));
        const matchesStatus = statusFilter === "all" || appt.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort(function (a, b) {
        const valueA = (getSortValue(a, sortState.key) + (sortState.key === "date" ? a.time : "")).toLowerCase();
        const valueB = (getSortValue(b, sortState.key) + (sortState.key === "date" ? b.time : "")).toLowerCase();
        const comparison = valueA.localeCompare(valueB, undefined, { numeric: true, sensitivity: "base" });
        return sortState.direction === "asc" ? comparison : comparison * -1;
      });

    const tbody = document.getElementById("apptTableBody");
    const noResults = document.getElementById("noResults");

    if (rows.length === 0) {
      tbody.innerHTML = "";
      noResults.hidden = false;
      return;
    }
    noResults.hidden = true;

    tbody.innerHTML = rows.map(function (appt) {
      const doc = doctorById(appt.doctorId) || { name: "Unknown", specialty: "-" };
      const canCancel = appt.status === "Upcoming";
      return (
        "<tr>" +
          "<td>" + appt.patient + "</td>" +
          "<td>" + doc.name + "</td>" +
          "<td>" + doc.specialty + "</td>" +
          "<td>" + appt.date + "</td>" +
          "<td>" + appt.time + "</td>" +
          '<td><span class="status-badge status-' + appt.status + '">' + appt.status + "</span></td>" +
          "<td>" +
            (canCancel
              ? '<button class="btn btn-small btn-danger" data-cancel-id="' + appt.id + '">Cancel</button>'
              : '<button class="btn btn-small btn-disabled" disabled>-</button>') +
          "</td>" +
        "</tr>"
      );
    }).join("");

    tbody.querySelectorAll("[data-cancel-id]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-cancel-id");
        const appt = appointments.find(function (a) { return a.id === id; });
        if (appt && confirm("Cancel appointment for " + appt.patient + "?")) {
          appt.status = "Cancelled";
          saveAppointments(appointments);
          renderAll();
        }
      });
    });
  }

  document.getElementById("searchInput").addEventListener("input", renderTable);
  document.getElementById("filterStatus").addEventListener("change", renderTable);
  document.querySelectorAll(".sort-header").forEach(function (button) {
    button.addEventListener("click", function () {
      const key = button.getAttribute("data-sort-key");

      if (sortState.key === key) {
        sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
      } else {
        sortState.key = key;
        sortState.direction = "asc";
      }

      updateSortHeaders();
      renderTable();
    });
  });

  function renderAll() {
    renderStats();
    renderTable();
  }

  populateDoctorSelect();
  renderDoctors();
  updateSortHeaders();
  renderAll();
})();
