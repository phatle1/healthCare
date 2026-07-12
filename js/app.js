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
  const PAGE_SIZE = 5;
  let currentPage = 1;
  const appointmentDetailsDialog = document.getElementById("appointmentDetailsDialog");
  const appointmentDetailsContent = document.getElementById("appointmentDetailsContent");

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character];
    });
  }

  function showAppointmentDetails(appt) {
    const doctor = doctorById(appt.doctorId) || { name: "Unknown doctor", specialty: "-" };
    appointmentDetailsContent.innerHTML =
      '<dl class="appointment-details-list">' +
        "<div><dt>Patient</dt><dd>" + escapeHtml(appt.patient) + "</dd></div>" +
        "<div><dt>Doctor</dt><dd>" + escapeHtml(doctor.name) + "</dd></div>" +
        "<div><dt>Specialty</dt><dd>" + escapeHtml(doctor.specialty) + "</dd></div>" +
        "<div><dt>Date</dt><dd>" + escapeHtml(appt.date) + "</dd></div>" +
        "<div><dt>Time</dt><dd>" + escapeHtml(appt.time) + "</dd></div>" +
        "<div><dt>Status</dt><dd>" + escapeHtml(appt.status) + "</dd></div>" +
        "<div><dt>Reason for Visit</dt><dd>" + escapeHtml(appt.reason) + "</dd></div>" +
      "</dl>";
    appointmentDetailsDialog.showModal();
  }

  document.getElementById("closeAppointmentDetails").addEventListener("click", function () {
    appointmentDetailsDialog.close();
  });
  appointmentDetailsDialog.addEventListener("click", function (event) {
    if (event.target === appointmentDetailsDialog) appointmentDetailsDialog.close();
  });

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

  function renderTodaysAppointments() {
    const container = document.getElementById("todayAppointments");
    const today = formatLocalDate(new Date());
    const todaysAppointments = appointments
      .filter(function (appt) {
        return appt.date === today && appt.status === "Upcoming";
      })
      .sort(function (a, b) {
        return a.time.localeCompare(b.time);
      });

    if (todaysAppointments.length === 0) {
      container.innerHTML = '<p class="today-empty">No upcoming appointments today.</p>';
      return;
    }

    container.innerHTML = todaysAppointments.map(function (appt) {
      const doctor = doctorById(appt.doctorId) || { name: "Unknown doctor", specialty: "" };
      return (
        '<article class="today-appointment">' +
          '<time class="today-time" datetime="' + appt.date + "T" + appt.time + '">' + appt.time + "</time>" +
          '<div class="today-details">' +
            '<strong>' + appt.patient + "</strong>" +
            "<span>" + doctor.name + (doctor.specialty ? " · " + doctor.specialty : "") + "</span>" +
          "</div>" +
        "</article>"
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
  const patientNameInput = document.getElementById("patientName");
  const appointmentDateInput = document.getElementById("apptDate");
  const appointmentTimeInput = document.getElementById("apptTime");

  function formatLocalDate(date) {
    return date.getFullYear() + "-" +
      String(date.getMonth() + 1).padStart(2, "0") + "-" +
      String(date.getDate()).padStart(2, "0");
  }

  function updateAppointmentTimeMin() {
    const now = new Date();
    const today = formatLocalDate(now);
    appointmentDateInput.min = today;

    if (appointmentDateInput.value === today) {
      now.setMinutes(now.getMinutes() + 1, 0, 0);
      appointmentTimeInput.min = now.getHours().toString().padStart(2, "0") + ":" +
        now.getMinutes().toString().padStart(2, "0");
    } else {
      appointmentTimeInput.removeAttribute("min");
    }
  }

  updateAppointmentTimeMin();
  appointmentDateInput.addEventListener("change", function () {
    appointmentTimeInput.setCustomValidity("");
    updateAppointmentTimeMin();
  });
  appointmentTimeInput.addEventListener("input", function () {
    this.setCustomValidity("");
  });
  patientNameInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^A-Za-z\s]/g, "");
  });

  document.getElementById("bookForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const patient = document.getElementById("patientName").value.trim();
    const doctorId = document.getElementById("doctorSelect").value;
    const date = document.getElementById("apptDate").value;
    const time = document.getElementById("apptTime").value;
    const reason = document.getElementById("apptReason").value.trim();

    if (!/^[A-Za-z\s]{4,100}$/.test(patient) || !doctorId || !date || !time || reason.length > 500) return;
    if (new Date(date + "T" + time) < new Date()) {
      appointmentTimeInput.setCustomValidity("Appointment date and time cannot be in the past.");
      appointmentTimeInput.reportValidity();
      return;
    }
    appointmentTimeInput.setCustomValidity("");

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
    currentPage = 1;
    renderAll();

    e.target.reset();
    updateAppointmentTimeMin();
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

  function renderPagination(totalRows) {
    const pagination = document.getElementById("appointmentPagination");
    const totalPages = Math.ceil(totalRows / PAGE_SIZE);

    if (totalPages <= 1) {
      pagination.hidden = true;
      pagination.innerHTML = "";
      return;
    }

    pagination.hidden = false;
    pagination.innerHTML =
      '<button type="button" class="btn btn-small" data-page="previous"' + (currentPage === 1 ? " disabled" : "") + '>Previous</button>' +
      '<span class="pagination-summary" aria-live="polite">Page ' + currentPage + " of " + totalPages + "</span>" +
      '<button type="button" class="btn btn-small" data-page="next"' + (currentPage === totalPages ? " disabled" : "") + '>Next</button>';

    pagination.querySelectorAll("[data-page]").forEach(function (button) {
      button.addEventListener("click", function () {
        currentPage += button.getAttribute("data-page") === "next" ? 1 : -1;
        renderTable();
      });
    });
  }

  function renderTable() {
    const searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();
    const dateFilter = document.getElementById("filterDate").value;
    const statusFilter = document.getElementById("filterStatus").value;

    const rows = appointments
      .filter(function (appt) {
        const doc = doctorById(appt.doctorId);
        const matchesSearch =
          !searchTerm ||
          appt.patient.toLowerCase().includes(searchTerm) ||
          (doc && doc.name.toLowerCase().includes(searchTerm));
        const matchesDate = !dateFilter || appt.date === dateFilter;
        const matchesStatus = statusFilter === "all" || appt.status === statusFilter;
        return matchesSearch && matchesDate && matchesStatus;
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
      renderPagination(0);
      return;
    }
    noResults.hidden = true;

    const totalPages = Math.ceil(rows.length / PAGE_SIZE);
    currentPage = Math.min(currentPage, totalPages);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const pageRows = rows.slice(startIndex, startIndex + PAGE_SIZE);

    tbody.innerHTML = pageRows.map(function (appt) {
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
              : '<button type="button" class="btn btn-small btn-details" data-details-id="' + appt.id + '">View Details</button>') +
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

    tbody.querySelectorAll("[data-details-id]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const appt = appointments.find(function (item) {
          return item.id === btn.getAttribute("data-details-id");
        });
        if (appt) showAppointmentDetails(appt);
      });
    });

    renderPagination(rows.length);
  }

  document.getElementById("searchInput").addEventListener("input", function () {
    currentPage = 1;
    renderTable();
  });
  document.getElementById("filterStatus").addEventListener("change", function () {
    currentPage = 1;
    renderTable();
  });
  document.getElementById("filterDate").addEventListener("change", function () {
    currentPage = 1;
    renderTable();
  });
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
      currentPage = 1;
      renderTable();
    });
  });

  function renderAll() {
    renderStats();
    renderTodaysAppointments();
    renderTable();
  }

  populateDoctorSelect();
  renderDoctors();
  updateSortHeaders();
  renderAll();
})();
