// Auth guard: include this in <head> (before <body> renders) on any page
// that requires a signed-in user. Redirects to the login page immediately
// if there is no active session.
(function () {
  if (sessionStorage.getItem("medicare_session") !== "true") {
    window.location.href = "index.html";
  }
})();
