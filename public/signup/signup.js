document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!fullName || !email || !password) {
    showToast("All fields are required", "error");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fullName, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        response.status === 409
          ? "This email already exists"
          : data.message || "Sign up failed. Please try again";
      showToast(message, "error");
      return;
    }

    showToast(data.message || "Sign Up successful. Now login", "success");
    e.target.reset();
  } catch (err) {
    console.error("Signup error:", err);
    showToast("Something went wrong. Please try again later.", "error");
  }
});

function showToast(message, type = "info") {
  const toastContainer = document.getElementById("toast-container");

  if (!toastContainer) {
    console.warn("Toast container not found");
    return;
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}
