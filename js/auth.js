(function () {
  const SESSION_KEY = "medicare_session";

  // If already logged in, skip straight to the dashboard.
  if (sessionStorage.getItem(SESSION_KEY) === "true") {
    window.location.href = "appointments.html";
    return;
  }

  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("loginError");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (isValidCredential(username, password)) {
      sessionStorage.setItem(SESSION_KEY, "true");
      sessionStorage.setItem("medicare_username", username);
      window.location.href = "appointments.html";
    } else {
      errorMsg.hidden = false;
    }
  });
})();
