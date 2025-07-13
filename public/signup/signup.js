document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    showToast("All fields are required", "error");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      const message =
        response.status === 409
          ? "This email already exists"
          : "Sign up failed. Please try again";
      showToast(message, "error");
      return;
    }

    showToast("Sign Up successful", "success");
    e.target.reset(); // Clear 
    
    window.location.href = '/user/signup'

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
