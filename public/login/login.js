const form = document.getElementById('form');
const membershipBtn = document.getElementById('buy_membership')

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showToast("All fields are required");
        return;
    }

    try {
        const response = await fetch(`https://expense-tracker-q5t0.onrender.com/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showToast(data.message || "Login failed. Try again!");
            return;
        }

        

        // Redirect after saving the token
        window.location.href = "/expense/add-expense";

    } catch (err) {
        showToast("Something went wrong");
        console.error("Login error:", err);
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


// membershipBtn.addEventListener('click', () => {
//     window.location.href = '/payment/';
// });
