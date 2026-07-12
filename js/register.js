(function () {
  const form = document.getElementById("registerForm");
  const errorMsg = document.getElementById("registerError");
  const successMsg = document.getElementById("registerSuccess");

  function showError(message) {
    errorMsg.textContent = message;
    errorMsg.hidden = false;
    successMsg.hidden = true;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    errorMsg.hidden = true;
    successMsg.hidden = true;

    const username = document.getElementById("newUsername").value.trim();
    const password = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (username.length < 3) {
      showError("Username must be at least 3 characters.");
      return;
    }
    if (password.length < 4 || password.length > 100) {
      showError("Password must be between 4 and 100 characters.");
      return;
    }
    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }

    const result = registerUser(username, password);
    if (!result.ok) {
      showError(result.error);
      return;
    }

    successMsg.hidden = false;
    setTimeout(function () {
      window.location.href = "index.html";
    }, 1200);
  });
})();
