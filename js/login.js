function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email === "admin@gmail.com" && password === "admin123") {
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("error").innerText = "Invalid login";
  }
}
