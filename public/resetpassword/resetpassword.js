const form = document.getElementById('reset-form'); // typo fixed from 'reset-from'

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (!newPassword || !confirmPassword) {
      return alert("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      // Get reset token from URL
      const pathParts = window.location.pathname.split('/');
      const token = pathParts[pathParts.length - 1];

      const response = await fetch(`https://expense-tracker-q5t0.onrender.com/payment-status/user/password/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: newPassword,
          confirmPassword: confirmPassword
        })
      });

      const data = await response.text();

      if (response.ok) {
        alert('Password reset successful');
        window.location.href = '/user/login'; // redirect if needed
      } else {
        alert(data || 'Failed to reset password');
      }

    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while resetting your password');
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