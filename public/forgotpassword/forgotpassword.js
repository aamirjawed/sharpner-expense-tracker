const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("forgot-password").value.trim();

  if (!email) {
    showToast("Email is required");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/user/password/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(data.message || "Something went wrong");
      return;
    }

    showToast(data.message || "Reset link sent successfully!");
    form.reset(); 
  } catch (error) {
    showToast("Network or server error: " + error.message);
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
